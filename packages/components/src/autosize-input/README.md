AutosizeInput
=============

AutosizeInput is a component which serves as a drop-in replacement for an `input` element. It automatically assigns its width to the minimum necessary to display its current value in its entirety.

Unlike the [`size` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-size), AutosizeInput handles non-uniform character widths (e.g. zero-width space characters).

## Usage

Use as you would any other `input` element. All props passed to AutosizeInput are forwarded to the rendered DOM element.

```jsx
import { AutosizeInput } from '@wordpress/components';

function MyInput() {
	return <AutosizeInput type="text" value="Hello World" />;
}
```
