interface ITagData {
  tag: string;
  attrs: Record<string, string>;
  children: Array<string | ITagData>;
}
interface IParseOptions {
  onTagOpen?: (tagName: string) => void;
  onTagClose?: (tagName: string, tagData: ITagData) => void;
}

export type ParseHtml = (html: string, options?: IParseOptions) => Array<ITagData | string>;

export const parseHtml: ParseHtml;

export class HTMLParser {
  parse: ParseHtml;
}

declare const defaultExport: {
  HTMLParser;
  parseHtml;
};

export default defaultExport;
