import React from 'react';
import Board from './../board/Board';
import * as Antd from 'antd';
import Steps, { Step } from './../steps/Steps';
import './Home.css';

interface TabPanel {
  key: string,
  title: string,
  content: React.ReactNode
}

interface State {
  steps: Step[]
}

class Home extends React.Component {

  state: State = {
    steps: [
      {
        title: 'First',
        content: <div>
          <Board 
          title="Salut trouve la solution"
          content={`typeof null === {};`}
          execute="code"
          message="La bonne réponse est bien true vous pouvez passez à l'exercise suivant"
          step="Home.javascript[0]"
          stepCondition="true"
          childrenToDragnDrop={['"boolean"',
          '"number"',
          '"string"',
          '"object"',
          '"undefined"',
          '"function"']}
          >
          </Board>
        </div>
      },
      {
        title: 'Second',
        content: 'Second-content'
      },
      {
        title: 'Last',
        content: 'Last-content'
      },
    ]
  }
  componentDidMount() {
  }

  setCondition(bool) {
    this.setState({condition: bool})
  }
  getTabPanel(): TabPanel[] {
    return [{
      key: '1',
      title: 'présentation',
      content: <div className="container">
        <div>
          <Board 
          title="Apprendre la programmation avec JavaScript"
          content={`\`\`function maFonction() {\\br
          \\tabalert({});\\br
          }\\br
          maFonction();\`\``}
          execute="code"
          childrenToDragnDrop={['"toto"',
          '"tutu"',
          '"titi"',
          '"toutou"',
          '"tata"']}
          >
          </Board>
        </div>
      </div>
    },
    {
      key: '2',
      title: 'javascript',
      content: <Steps path="Home.javascript" steps={this.state.steps}></Steps>
    }]
  }
  render(): React.ReactNode {
    return (
    <div>
      <h1>Home</h1>
      <Antd.Tabs
        defaultActiveKey="1"
      >
        {this.getTabPanel().map(tab =>
          <Antd.Tabs.TabPane key={tab.key} tab={tab.title}>{tab.content}</Antd.Tabs.TabPane>
        )}
      </Antd.Tabs>
    </div>
    );
  }
}

export default Home;