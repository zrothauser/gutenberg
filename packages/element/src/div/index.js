const DIV = ( props ) => {
    const { children, ...otherProps } = props;
    return (
        <div { ...otherProps }>
            { children }
        </div>
    );
};

export default DIV;