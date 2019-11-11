import dlv from 'dlv';
import split from 'split-string';

const brackets = {
  '{': 0,
  '}': 0,
};

function compiler(startingString, lastChar = null, skipTo = 0) {
  const value = skipTo ? startingString.slice(skipTo) : startingString;
  const openingIndex = value.indexOf('{');
  const closingIndex = value.indexOf('}');

  if (openingIndex === -1 && closingIndex === -1) {
    return [startingString];
  }

  if (openingIndex < closingIndex && openingIndex !== -1) {
    const invalid = brackets['{'] > brackets['}'];

    brackets['{'] += 1;

    if (invalid) {
      return compiler(startingString, value.charAt(openingIndex), openingIndex + skipTo + 1);
    }

    const firstFull = startingString.slice(0, openingIndex + skipTo);
    const secondFull = startingString.slice(openingIndex + skipTo + 1);

    return [
      firstFull,
      ...compiler(secondFull, value.charAt(openingIndex + skipTo)),
    ];
  }

  if (openingIndex > closingIndex && closingIndex !== -1 || openingIndex === -1) {
    brackets['}'] += 1;

    if (brackets['{'] !== brackets['}']) {
      return compiler(startingString, value.charAt(closingIndex), closingIndex + skipTo + 1);
    }

    const firstFull = startingString.slice(0, closingIndex + skipTo);
    const secondFull = startingString.slice(closingIndex + skipTo + 1);

    return [
      {
        value: firstFull,
      },
      ...compiler(secondFull, value.charAt(closingIndex + skipTo)),
    ];
  }

  return [startingString];
}

export class MessageFormat {
  private defaultLocale: string = 'en';
  private formatters: Record<string, any>;

  constructor(defaultLocale: string) {
    this.defaultLocale = defaultLocale;
    this.formatters = {
      uppercase(value, language, params) {
        return value.toUpperCase();
      },
    };
  }

  public addFormatters(formatters) {
    Object.assign(this.formatters, formatters);
    return this;
  }

  public compile(stringData: string): (props: Record<string, any>) => string {
    const compiled = compiler(stringData);

    return (props) => compiled.map((chunk) => {
      if (chunk && typeof chunk === 'object' && chunk.value) {
        const [key, formatter, params] = split(chunk.value, { separator: ',' });
        const value = dlv(props, key.trim());

        if (!formatter) {
          return value;
        }

        const transformerMethod = this.formatters[formatter.trim()];

        if (typeof transformerMethod !== 'function') {
          throw new Error(`[MessageFormat] Formatter named "${formatter.trim()}" not found`);
        }

        return transformerMethod(value, this.defaultLocale, params);
      }

      return chunk;
    }).join('');
  }
}

export const messageFormat = new MessageFormat('en');
