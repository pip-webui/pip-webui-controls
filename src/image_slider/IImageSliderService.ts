export interface IImageSliderService {
    registerSlider(sliderId: string, sliderScope): void;
    removeSlider(sliderId: string): void;
    getSliderScope(sliderId: string);
    nextCarousel(nextBlock, prevBlock): void;
    prevCarousel(nextBlock, prevBlock): void;
    toBlock(type: string, blocks: any[], oldIndex: number, nextIndex: number, direction: string): void;
}