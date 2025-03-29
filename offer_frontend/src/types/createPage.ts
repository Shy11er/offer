import { ObjectDto } from "./object";

export interface StepProps {
    form: Partial<ObjectDto>;
    handleChange: (field: keyof ObjectDto, value: any) => void;
}