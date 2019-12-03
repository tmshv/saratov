import React, { Component } from 'react';
import className from 'classnames';
import Cesium from 'cesium/Cesium';

const isFunction = f => typeof f === 'function';

export default class Map extends Component {
    constructor(props) {
        super(props);
        this.onMapRender = this.onMapRender.bind(this);
    }

    componentWillReceiveProps(newProps) {
        const { onCanvasRender } = newProps;
        if (isFunction(onCanvasRender)) {
            this.unsubscribeCanvasUpdate();
            this.subscribeCanvasUpdate();
        } else {
            this.unsubscribeCanvasUpdate();
        }
    }

    subscribeCanvasUpdate() {
        this.cesium.scene.postRender.addEventListener(this.onMapRender);
    }

    unsubscribeCanvasUpdate() {
        this.cesium.scene.postRender.removeEventListener(this.onMapRender);
    }

    onMapRender() {
        const { onCanvasRender } = this.props;
        const canvas = this.cesium.scene.canvas;
        onCanvasRender(canvas);
    }

    componentDidMount() {
        const { options, init } = this.props;
        this.cesium = new Cesium.Viewer(this.element, {
            ...options,
            creditContainer: this.creditContainer,
        });

        init(this.cesium);
    }

    componentWillUnmount() {
        this.unsubscribeCanvasUpdate();
        // destroy(this.cesium);
    }

    render() {
        const { canInteract } = this.props;

        const cn = className('Map', {
            'Map--interactive': canInteract,
        });

        return (
            <div className={cn}
                ref={x => {
                    this.element = x;
                }}
            >
                <div ref={x => {
                    this.creditContainer = x;
                }} />
            </div>
        );
    }
};
