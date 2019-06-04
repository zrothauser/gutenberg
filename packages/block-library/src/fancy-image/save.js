
export default function FancyImageSave( { attributes } ) {
	const {
		src,
		alt,
	} = attributes;

	return (
		<img alt={ alt } src={ src } />
	);
}
