import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { styles } from './style';

export class Notifier extends React.Component {
  static propTypes = {
    /**
     * The duration to display the messsage
     */
    duration: PropTypes.number,
    /**
     * The message to display
     */
    message: PropTypes.string,
    /**
     * Font size
     */
    fontSize: PropTypes.number,
  };

  static defaultProps = {
    duration: 2000,
    message: null,
    fontSize: 16,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (this._isMounted && prevState.message !== nextProps.message) {
      return { message: nextProps.message };
    }

    return null;
  }

  state = {
    message: this.props.message,
  };

  _isMounted = false;

  render() {
    let view = null;

    if (this.state.message) {
      view = (
        <View style={styles.container}>
          <Text style={[styles.text, this.props.fontSize]}>
            {this.state.message}
          </Text>
        </View>
      );
    }

    return view;
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentDidUpdate() {
    if (this.state.message) {
      setTimeout(() => {
        if (this._isMounted) {
          this.setState({ message: null });
        }
      }, this.props.duration);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
}
