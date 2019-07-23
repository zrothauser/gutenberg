 /**
 * External dependencies
 */
import { View } from 'react-native';

const DIV = ( props ) => {
    const { children, ...otherProps } = props;
    return (
        <View { ...otherProps }>
            { children }
        </View>
    );
};

export default DIV;