const UL = ( props ) => {
    const { children, ...otherProps } = props;
    return (
        <ul { ...otherProps }>
            { children }
        </ul>
    );
};

export default UL;