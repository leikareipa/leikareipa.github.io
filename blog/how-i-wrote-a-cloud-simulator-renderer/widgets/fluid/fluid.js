/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Adapted from Stam: Real-time fluid dynamics for games
 * (http://graphics.cs.cmu.edu/nsp/course/15-464/Fall09/papers/StamFluidforGames.pdf).
 *
 */

"use strict";

const TICK_RATE = 0.1;
const NUM_PROJECT_LOOPS = 20;
let IS_INITIALIZED = false,
    DOMAIN_SIZE = 0,
    VORTICITY_STRENGTH = 0,
    VEL_GRID_SIZE = 0,
    VEL_U = [],
    VEL_V = [],
    U0 = [],
    V0 = [];

function lerp(x, y, interval)
{
    return (x + (interval * (y - x)));
}
    
export function velocity_at(x = 0, y = 0)
{
    console.assert(IS_INITIALIZED);

    const idx = vel_idx(x, y);

    return {
        u: VEL_U[idx],
        v: VEL_V[idx],
    };
}

export function initialize({domainSize, vorticityStrength})
{
    console.assert(!IS_INITIALIZED);

    DOMAIN_SIZE = domainSize;
    VORTICITY_STRENGTH = vorticityStrength;
    VEL_GRID_SIZE = ((DOMAIN_SIZE + 2) ** 2);
    VEL_U = new Array(VEL_GRID_SIZE).fill(0);
    VEL_V = new Array(VEL_GRID_SIZE).fill(0);
    U0 = new Array(VEL_GRID_SIZE).fill(0);
    V0 = new Array(VEL_GRID_SIZE).fill(0);
    IS_INITIALIZED = true;

    return;
}

export function set_force({x = 0, y = 0, dU = 0, dV = 0} = {})
{
    console.assert(IS_INITIALIZED);

    const idx = vel_idx(x, y);
    VEL_U[idx] = dU;
    VEL_V[idx] = dV;

    return;
}

export function apply_force({x = 0, y = 0, dU = 0, dV = 0} = {})
{
    console.assert(IS_INITIALIZED);

    const idx = vel_idx(x, y);

    VEL_U[idx] = (dU != 0)? lerp(dU, VEL_U[idx], 0.85) : VEL_U[idx];
    VEL_V[idx] = (dV != 0)? lerp(dV, VEL_V[idx], 0.85) : VEL_V[idx];

    return;
}

export function tick()
{
    console.assert(IS_INITIALIZED);

    vorticify();
    project(VEL_U, VEL_V, U0, V0);
    [U0, VEL_U] = [VEL_U, U0];
    [V0, VEL_V] = [VEL_V, V0];
    advect(VEL_U, U0, U0, V0, TICK_RATE);
    advect(VEL_V, V0, U0, V0, TICK_RATE);
    project(VEL_U, VEL_V, U0, V0);

    return;
}

function vel_idx(x, y)
{
    return Math.floor(x + y * (DOMAIN_SIZE + 2));
}

function vorticify()
{
    for (let i = 1; i <= DOMAIN_SIZE; ++i)
    {
        for (let j = 1; j <= DOMAIN_SIZE; ++j)
        {
            const uy = (VEL_U[vel_idx(i,j+1)] - VEL_U[vel_idx(i,j-1)]) * 0.5;
            const vx = (VEL_V[vel_idx(i+1,j)] - VEL_V[vel_idx(i-1,j)]) * 0.5;

            U0[vel_idx(i, j)] = Math.abs(uy-vx);
        }
    }

    for (let i = 2; i < DOMAIN_SIZE; ++i)
    {
        for (let j = 2; j < DOMAIN_SIZE; ++j)
        {
            let wx = (U0[vel_idx(i+1,j)] - U0[vel_idx(i-1,j)]) * 0.5;
            let wy = (U0[vel_idx(i,j+1)] - U0[vel_idx(i,j-1)]) * 0.5;
            const len = (1 / (Math.sqrt(wx**2 + wy**2) + 0.000001));

            wx *= len;
            wy *= len;

            const uy = (VEL_U[vel_idx(i,j+1)] - VEL_U[vel_idx(i,j-1)]) * 0.5;
            const vx = (VEL_V[vel_idx(i+1,j)] - VEL_V[vel_idx(i-1,j)]) * 0.5;
            const t = (uy - vx);

            VEL_U[vel_idx(i,j)] += (wy * -t * VORTICITY_STRENGTH);
            VEL_V[vel_idx(i,j)] += (wx * t * VORTICITY_STRENGTH);
        }
    }

    return;
}

function project(u, v, p, div)
{
    const h = 1.0 / DOMAIN_SIZE;

    for (let i = 1; i <= DOMAIN_SIZE; i++)
    {
        for (let j = 1; j <= DOMAIN_SIZE; j++)
        {
            div[vel_idx(i, j)] =
                -0.5 * h
                * (u[vel_idx(i+1,j)] - u[vel_idx(i-1,j)] + v[vel_idx(i,j+1)] - v[vel_idx(i,j-1)]);
            p[vel_idx(i,j)] = 0;
        }
    }

    for (let k = 0; k < NUM_PROJECT_LOOPS; k++)
    {
        for (let i = 1; i <= DOMAIN_SIZE; i++)
        {
            for (let j = 1; j <= DOMAIN_SIZE; j++)
            {
                p[vel_idx(i, j)] =
                    (div[vel_idx(i,j)] + p[vel_idx(i-1,j)]
                    + p[vel_idx(i+1,j)] + p[vel_idx(i,j-1)] + p[vel_idx(i,j+1)]) / 4;
            }
        }
    }

    for (let i = 1; i <= DOMAIN_SIZE; i++)
    {
        for (let j = 1; j <= DOMAIN_SIZE; j++)
        {
            u[vel_idx(i,j)] -= 0.5 * (p[vel_idx(i+1,j)] - p[vel_idx(i-1,j)]) / h;
            v[vel_idx(i,j)] -= 0.5 * (p[vel_idx(i,j+1)] - p[vel_idx(i,j-1)]) / h;
        }
    }

    return;
}

function advect(d, d0, u, v, dt)
{
    const dt0 = dt * DOMAIN_SIZE;

    for (let i = 1; i <= DOMAIN_SIZE; i++)
    {
        for (let j = 1; j <= DOMAIN_SIZE; j++)
        {
            const x = Math.max(0.5, Math.min((DOMAIN_SIZE + 0.5), i - dt0 * u[vel_idx(i,j)]));
            const y = Math.max(0.5, Math.min((DOMAIN_SIZE + 0.5), j - dt0 * v[vel_idx(i,j)]));
            const i0 = Math.floor(x);
            const i1 = i0 + 1;
            const j0 = Math.floor(y);
            const j1 = j0 + 1;
            const s1 = x - i0;
            const s0 = 1 - s1;
            const t1 = y - j0;
            const t0 = 1 - t1;

            d[vel_idx(i,j)] =
                s0 * (t0 * d0[vel_idx(i0,j0)] + t1 * d0[vel_idx(i0,j1)])
                + s1 * (t0 * d0[vel_idx(i1,j0)] + t1 * d0[vel_idx(i1,j1)]);
        }
    }

    return;
}
