type TemplateData = Record<string, string>;

export const renderTemplate = (template: string, data: TemplateData): string => {
    return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] || '');
};
