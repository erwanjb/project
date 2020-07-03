import React, { ReactNode } from 'react';
import * as Antd from 'antd';
import axios from 'axios';

interface StepsProps {
    steps: Step[]
    path: string
}
export interface Step {
    title: string,
    content: string | React.ReactNode,
}
interface State {
    current: number
  }

class Steps extends React.Component<StepsProps> {

    state: State = {
        current: 0
      }

    async next() {
        const path = this.props.path.split('.');
        let token = localStorage.getItem('steps');
        if (!token) {
            const getToken = await axios({
                method: 'GET',
                url: '/tokenSteps/getToken'
            });

            token = getToken.data;
            localStorage.setItem('steps', token);
        }
        const objSteps = await axios({
            method: 'GET',
            url: '/tokenSteps/getObjSteps',
            params: {
                token
            }
        });
        let condition = objSteps.data;
        for (const p of path) {
            condition = condition[p];
        }
        console.log(condition);
        if(condition[this.state.current]) {
            const current = this.state.current + 1;
            console.log(current)
            this.setState({ current });
        }
    }
    
    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    onChange (current) {
        this.setState({ current });
    }

    render(): ReactNode {
        return (
            <div>
                <Antd.Steps current={this.state.current} onChange={this.onChange.bind(this)}>
                    {this.props.steps.map((item, index) => (
                        <Antd.Steps.Step key={index + item.title} title={item.title} />
                    ))}
                </Antd.Steps>
                <div className="steps-content">{this.props.steps[this.state.current].content}</div>
                <div className="steps-action">
                {this.state.current > 0 && (
                    <Antd.Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                    Previous
                    </Antd.Button>
                )}
                {this.state.current < this.props.steps.length - 1 && (
                    <Antd.Button type="primary" onClick={async() => await this.next()}>
                    Next
                    </Antd.Button>
                )}
                {this.state.current === this.props.steps.length - 1 && (
                    <Antd.Button type="primary" onClick={() => Antd.message.success('Processing complete!')}>
                    Done
                    </Antd.Button>
                )}
                </div>
            </div>
        );
     }
}

export default Steps;