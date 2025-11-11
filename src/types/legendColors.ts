export const vinsBlancs = {
    GrandCru: '#FFEB00', // hsl(52°, 100%, 50%) — vivid, bright yellow; striking and luminous for top-tier Grand Cru
    PremierCru: '#FFF27F', // hsl(52°, 90%, 75%) — softer, warm yellow; refined but still clearly golden
    Village: '#FFF9CC' // hsl(52°, 80%, 90%) — pale, delicate yellow; subtle and gentle for background village areas
};

export const vinsRouges = {
    GrandCru: '#ef4865',
    PremierCru: '#c475b0',
    Village: '#fb766d',
    Mixed: '#6f42c1'
}

const vinAligote = '#c8cde9';

export const grandCruVarietalColors = {
    Chardonnay: vinsBlancs.GrandCru,
    PinotNoir: vinsRouges.GrandCru,
    Aligote: vinAligote
}

export const premierCruVarietalColors = {
    Chardonnay: vinsBlancs.PremierCru,
    PinotNoir: vinsRouges.PremierCru,
    Mixed: vinsRouges.Mixed,
    Aligote: vinAligote
}

export const villageVarietalColors = {
    Chardonnay: vinsBlancs.Village,
    PinotNoir: vinsRouges.Village,
    Aligote: vinAligote
}