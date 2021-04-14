"use strict";

import { LL_Observation } from "./observation.js";
import { ll_assert_native_type } from "./assert.js";
const sataLajia = ["Alli", "Fasaani", "Haahka", "Haapana", "Haarapääsky", "Harakka", "Härkälintu", "Harmaahaikara", "Harmaapäätikka", "Harmaasieppo", "Helmipöllö", "Hiirihaukka", "Hiiripöllö", "Hömötiainen", "Huuhkaja", "Isokoskelo", "Järripeippo", "Käenpiika", "Käki", "Käpytikka", "Kaulushaikara", "Kehrääjä", "Keltasirkku", "Keltavästäräkki", "Kesykyyhky", "Kirjosieppo", "Kivitasku", "Korppi", "Koskikara", "Kottarainen", "Kultarinta", "Kuovi", "Kurki", "Kuukkeli", "Kuusitiainen", "Kyhmyjoutsen", "Laulujoutsen", "Laulurastas", "Lehtokurppa", "Liro", "Luhtakerttunen", "Merilokki", "Metsähanhi", "Metso", "Mustalintu", "Mustapääkerttu", "Närhi", "Naurulokki", "Niittykirvinen", "Nokikana", "Pajulintu", "Pajusirkku", "Palokärki", "Peippo", "Peltosirkku", "Pensassirkkalintu", "Piekana", "Pikkukäpylintu", "Pikkulokki", "Pikkuvarpunen", "Pilkkasiipi", "Pulmunen", "Punakylkirastas", "Punarinta", "Punatulkku", "Puukiipijä", "Pyrstötiainen", "Räkättirastas", "Rantasipi", "Räystäspääsky", "Ruskosuohaukka", "Rytikerttunen", "Sääksi", "Selkälokki", "Sepelkyyhky", "Silkkiuikku", "Sinirinta", "Sinisorsa", "Sinisuohaukka", "Sinitiainen", "Sirittäjä", "Suokukko", "Talitiainen", "Tavi", "Teeri", "Telkkä", "Tikli", "Tilhi", "Törmäpääsky", "Töyhtötiainen", "Tukkakoskelo", "Tundrahanhi", "Tuulihaukka", "Urpiainen", "Valkoposkihanhi", "Varis", "Varpunen", "Varpushaukka", "Varpuspöllö", "Västäräkki"].map(species => LL_Observation({
  species
}));
export function merge_100_lajia_with(observations = [LL_Observation]) {
  ll_assert_native_type("array", observations);
  return sataLajia.reduce((mergedArr, sataObs) => {
    const existingObservation = observations.find(e => e.species === sataObs.species);
    mergedArr.push(existingObservation ? existingObservation : sataObs);
    return mergedArr;
  }, []);
}