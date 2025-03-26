/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 */

"use strict";

const CONSTANTS = {
    surfaceTemperature: 28,
    environmentalLapseRate: 6.5,
    dryAdiabaticLapseRate: 14.8,
    atmosphericPressurePa: 101325,
    waterMoleMassKg: 0.018,
    dryAirMoleMassKg: 0.029,
}

const GRIDS = {
    temperature: [],
    buoyancy: [],
    moisture: [],
    relativeHumidity: [],
};

let IS_INITIALIZED = false,
    DOMAIN_SIZE,
    GRID_SIZE,
    CELLS_PER_KM;

export function temperature_at(x = 0, y = 0)
{
    console.assert(IS_INITIALIZED);
    return GRIDS.temperature[x + y * DOMAIN_SIZE];
}

export function relative_humidity_at(x = 0, y = 0)
{
    console.assert(IS_INITIALIZED);
    return GRIDS.relativeHumidity[x + y * DOMAIN_SIZE];
}

export function moisture_at(x = 0, y = 0)
{
    console.assert(IS_INITIALIZED);
    return GRIDS.moisture[x + y * DOMAIN_SIZE];
}

export function set_temperature({x = 0, y = 0, c = 0} = {})
{
    console.assert(IS_INITIALIZED);
    GRIDS.temperature[x + y * DOMAIN_SIZE] = c;

    return;
}

export function set_moisture({x = 0, y = 0, g = 0} = {})
{
    console.assert(IS_INITIALIZED);
    GRIDS.moisture[x + y * DOMAIN_SIZE] = g;

    return;
}

export function apply_temperature({x = 0, y = 0, c = 0} = {})
{
    console.assert(IS_INITIALIZED);
    GRIDS.temperature[x + y * DOMAIN_SIZE] += c;

    return;
}

export function initialize({domainSize, fluid})
{
    console.assert(!IS_INITIALIZED);

    DOMAIN_SIZE = domainSize;
    GRID_SIZE = ((DOMAIN_SIZE + 2) ** 2);
    CELLS_PER_KM = (DOMAIN_SIZE / 10);

    GRIDS.buoyancy = new Array(GRID_SIZE).fill(0);
    GRIDS.moisture = new Array(GRID_SIZE).fill(0);
    GRIDS.relativeHumidity = new Array(GRID_SIZE).fill(0);

    GRIDS.temperature = new Array(GRID_SIZE);
    for (let y = 0; y < DOMAIN_SIZE+2; y++)
    {
        for (let x = 0; x < DOMAIN_SIZE+2; x++)
        {
            GRIDS.temperature[x + y * DOMAIN_SIZE] = atmosphere_temperature_at((DOMAIN_SIZE - y) / CELLS_PER_KM);
        }
    }

    IS_INITIALIZED = true;

    return;
}

export function tick({fluid})
{
    console.assert(IS_INITIALIZED);

    migrate_cells_with_fluid(fluid);
    calculate_condensation(fluid);
    apply_buoyancy(fluid);

    return;
}

function lerp(x, y, interval)
{
    return (x + (interval * (y - x)));
}

function atmosphere_temperature_at(heightKm)
{
    return (CONSTANTS.surfaceTemperature - (heightKm * CONSTANTS.environmentalLapseRate));
}

function apply_buoyancy(fluid)
{
    for (let y = 2; y <= (DOMAIN_SIZE - 1); y++)
    {
        for (let x = 2; x <= (DOMAIN_SIZE - 1); x++)
        {
            const surroundingTemperature =
                (GRIDS.temperature[(x-1) + y * DOMAIN_SIZE] +
                 GRIDS.temperature[(x+1) + y * DOMAIN_SIZE]) / 2;
            const thisTemperature = GRIDS.temperature[x + y * DOMAIN_SIZE];
            const surroundingAirTemperature = atmosphere_temperature_at((DOMAIN_SIZE - y) / CELLS_PER_KM);
            const avgTemperature = lerp(surroundingTemperature, surroundingAirTemperature, 0.7);

            let buoyancy = ((thisTemperature - avgTemperature) / 10);

            if (thisTemperature == atmosphere_temperature_at(y / CELLS_PER_KM))
            {
                buoyancy = 0;
            }

            if (Math.abs(buoyancy) < Number.EPSILON)
            {
                buoyancy = 0;
            }

            fluid.apply_force({x, y, dV: -buoyancy,});
        }
    }
}

function calculate_condensation(fluid)
{
    for (let y = 1; y <= DOMAIN_SIZE; y++)
    {
        for (let x = 1; x <= DOMAIN_SIZE; x++)
        {
            const fluidVelocity = fluid.velocity_at(x, y);

            // Apply basic evaporation and evaporative cooling.
            {
                const evaporationRate = 0.9985;
                const evaporation = (GRIDS.moisture[x + y * DOMAIN_SIZE] - Math.max(0, (GRIDS.moisture[x + y * DOMAIN_SIZE] * evaporationRate)));
                GRIDS.moisture[x + y * DOMAIN_SIZE] -= evaporation;
                GRIDS.temperature[x + y * DOMAIN_SIZE] -= evaporation;
            }

            const temperature = GRIDS.temperature[x + y * DOMAIN_SIZE];
            const moisture = GRIDS.moisture[x + y * DOMAIN_SIZE];

            {
                const airPressure =
                    CONSTANTS.atmosphericPressurePa *
                    Math.pow(
                        1.0 - ((CONSTANTS.environmentalLapseRate * (y / CELLS_PER_KM)) / (CONSTANTS.surfaceTemperature + 273.15)),
                        (CONSTANTS.dryAdiabaticLapseRate * CONSTANTS.dryAirMoleMassKg) / (8.31447 * CONSTANTS.environmentalLapseRate)
                    );

                const vaporPressure = 610.78 * Math.exp(temperature / (temperature + 238.3) * 10);

                const relativeHumidity =
                    (moisture / 1000.0) /
                    (
                        (CONSTANTS.waterMoleMassKg * vaporPressure) /
                        (CONSTANTS.dryAirMoleMassKg * (airPressure - vaporPressure))
                    );

                GRIDS.relativeHumidity[x + y * DOMAIN_SIZE] = relativeHumidity;

                // Dry adiabatic lapse rate.
                if (relativeHumidity <= 1.0)
                {
                    const lapseRate = (CONSTANTS.dryAdiabaticLapseRate * (fluidVelocity.v / CELLS_PER_KM));
                    GRIDS.temperature[x + y * DOMAIN_SIZE] += lapseRate;
                    
                }
                // Moist adiabatic lapse rate.
                else
                {
                    const maxAirWaterVaporCapacity = 1000 * (0.018 * vaporPressure / (0.029 * (airPressure - vaporPressure)));
                    const excessWaterVapor = (moisture - maxAirWaterVaporCapacity);
                    const moistAdiabatic = (9.80665 * ((1.0 + (2501.0 * moisture) /
                                                       (287.058 * (temperature + 237.15))) / (1005.7 +
                                                       (Math.pow(2501.0, 2) * moisture * 622) /
                                                       (287.058 * Math.pow(temperature + 237.15, 2))))) * 1000.0;

                    if (!Number.isFinite(excessWaterVapor))
                    {
                        excessWaterVapor = 0;
                    }

                    if (!Number.isFinite(moistAdiabatic))
                    {
                        moistAdiabatic = 0;
                    }

                    const lapseRate = (moistAdiabatic * (fluidVelocity.v / CELLS_PER_KM));
                    GRIDS.temperature[x + y * DOMAIN_SIZE] += lapseRate;
                    GRIDS.moisture[x + y * DOMAIN_SIZE] -= excessWaterVapor;
                }
            }
        }
    }
    
    return;
}

function migrate_cells_with_fluid(fluid)
{
    console.assert(IS_INITIALIZED);

    const resultingTemperature = new Array(GRIDS.temperature.length).fill(0);
    const resultingMoisture = new Array(GRIDS.moisture.length).fill(0);

    for (let y = 1; y <= DOMAIN_SIZE; y++)
    {
        for (let x = 1; x <= DOMAIN_SIZE; x++)
        {
            const fluidVelocity = fluid.velocity_at(x, y);
            const velocityMagnitude = Math.max(Number.EPSILON, Math.sqrt(fluidVelocity.u**2 + fluidVelocity.v**2));
            const isSubCellMovement = (velocityMagnitude < 1);

            if (isSubCellMovement)
            {
                // Normalize the velocity.
                fluidVelocity.u /= velocityMagnitude;
                fluidVelocity.v /= velocityMagnitude;
            }

            const fluidSource = {
                x: Math.floor(Math.max(1, Math.min((DOMAIN_SIZE - 1), x + 0.5 - fluidVelocity.u))),
                y: Math.floor(Math.max(1, Math.min((DOMAIN_SIZE - 1), y + 0.5 - fluidVelocity.v))),
            };

            if (isSubCellMovement)
            {
                resultingTemperature[x + y * DOMAIN_SIZE] =
                    lerp(
                        GRIDS.temperature[x + y * DOMAIN_SIZE],
                        GRIDS.temperature[fluidSource.x + fluidSource.y * DOMAIN_SIZE],
                        velocityMagnitude
                    );

                resultingMoisture[x + y * DOMAIN_SIZE] =
                    lerp(
                        GRIDS.moisture[x + y * DOMAIN_SIZE],
                        GRIDS.moisture[fluidSource.x + fluidSource.y * DOMAIN_SIZE],
                        velocityMagnitude
                    );
            }
            else
            {
                resultingTemperature[x + y * DOMAIN_SIZE] =
                    GRIDS.temperature[fluidSource.x + fluidSource.y * DOMAIN_SIZE];

                resultingMoisture[x + y * DOMAIN_SIZE] =
                    GRIDS.moisture[fluidSource.x + fluidSource.y * DOMAIN_SIZE];
            }
        }
    }

    for (let i = 0; i < GRIDS.temperature.length; i++)
    {
        GRIDS.temperature[i] = resultingTemperature[i];
        GRIDS.moisture[i] = resultingMoisture[i];
    }

    return;
}