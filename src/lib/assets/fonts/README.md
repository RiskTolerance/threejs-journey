Fonts are converted to json via https://gero3.github.io/facetype.js/

One issue that I've noted after converting the font is that the font file is not typesafe after conversion. The json property "original_font_information" has a key "format" whose value is a number by default. This throws a type error.

This property can be safely deleted or changed to a string.