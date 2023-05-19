interface ITagData {
  tag: string;
  attrs: Record<string, string>;
  children: string | ITagData;
}

interface IParseOptions {
  onTagOpen?: (tagName: string) => void;
  onTagClose?: (tagName: string, tagData: ITagData) => void;
}

type ParseHtml = (html: string, options?: IParseOptions) => Array<ITagData | string>;

export const parseHtml: ParseHtml;

export class HTMLParser {
  parse: ParseHtml;
}

export default HTMLParser;
