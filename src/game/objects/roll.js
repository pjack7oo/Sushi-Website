//roll object and its functions
export function Roll()
{
    this.nori = true;
    this.name = '';
    this.inner = [];
    this.outer = [];
    this.renderType = Box;
    this.canEnterMatt = false;
    this.canEnterCuttingStation = true;
    this.canEnterPlate = false;
    this.isCut = false;
}