declare module pip.controls {




export interface IImageSliderService {
    registerSlider(sliderId: string, sliderScope: any): void;
    removeSlider(sliderId: string): void;
    getSliderScope(sliderId: string): any;
    nextCarousel(nextBlock: any, prevBlock: any): void;
    prevCarousel(nextBlock: any, prevBlock: any): void;
    toBlock(type: string, blocks: any[], oldIndex: number, nextIndex: number, direction: string): void;
}



var marked: any;





}
