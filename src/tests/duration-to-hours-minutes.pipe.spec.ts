import { DurationToHoursMinutesPipe } from '../app/duration-to-hours-minutes.pipe';

describe('DurationToHoursMinutesPipe', () => {
    let pipe: DurationToHoursMinutesPipe;

    beforeEach(() => {
        pipe = new DurationToHoursMinutesPipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should transform 45 minutes to "00h45m"', () => {
        expect(pipe.transform(45)).toBe('00h45m');
    });

    it('should transform 60 minutes to "1h 0m"', () => {
        expect(pipe.transform(60)).toBe('1h 0m');
    });

    it('should transform 125 minutes to "2h 5m"', () => {
        expect(pipe.transform(125)).toBe('2h 5m');
    });

    it('should transform 90 minutes to "1h 30m"', () => {
        expect(pipe.transform(90)).toBe('1h 30m');
    });
});
