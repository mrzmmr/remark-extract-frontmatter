import { Plugin } from "unified";

declare namespace remarkExtractFrontmatter {
  type ExtractPlugin = Plugin<[RemarkExtractFrontmatterOptions?]>;

  type RemarkExtractFrontmatterOptions = Options | Function;

  interface Options {
    /**
     * Specify the function (value) to use when parsing a frontmatter type `yaml`.
     * For example, options could be `{ yaml: require('yaml').parse }`.
     * If no parsing function is set then this plugin will do nothing by default.
     */
    yaml?: Function;

    /**
     * Specify the function (value) to use when parsing a frontmatter type `toml`.
     * For example, options could be `{ toml: require('toml').parse }`.
     * If no parsing function is set then this plugin will do nothing by default.
     */
    toml?: Function;

    /**
     * Specify a key to store frontmatter in for example, `{ name: 'frontmatter' }`
     * will store any parsed frontmatter as `data: { frontmatter: { ... } }`.
     * By default the parsed frontmatter is merged into the data object.
     */
    name?: string;

    /**
     * Specify if when an error parsing frontmatter occurs, to fail and throw error using
     * `VFile.fail` or continue and set a warning using `VFile.message`
     */
    throws?: boolean;
  }
}

declare const remarkFrontmatterPlugin: remarkExtractFrontmatter.ExtractPlugin;

export = remarkFrontmatterPlugin;
