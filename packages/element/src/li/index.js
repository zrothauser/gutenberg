const LI = ( props ) => {
    const { children, ...otherProps } = props;
	return (
        <li { ...otherProps }>
            { children }
        </li>
    );
};

export default LI;