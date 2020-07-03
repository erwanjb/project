import React, { ReactNode } from 'react';
import './Board.css';
import axios from 'axios';
import * as Antd from 'antd';
import DragnDrop from './../../../utils/drad&drop/Dragndrop';
import styled, { keyframes, css } from 'styled-components';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';

interface BoardProps {
    title: string,
    content: string,
    execute?: 'code' | 'noCode',
    message?: string,
    step?: string,
    stepCondition?: any
    childrenToDragnDrop?:string[]
}

class Board extends React.Component<BoardProps> {
    state = {
        classDrop: "tokenContainer",
        contentBr: this.props.content.split("\\br"),
        contentBlock: this.props.content.split("{}"),
        contentCode: this.props.content.split('``'),
        items: this.props.childrenToDragnDrop,
        itemsObj: [],
        booleanForStyledBackGroundCode: false,
        content: []
    }
    carouselItem:any[] = []
    componentDidMount(){
        const numberTag = this.state.contentBlock.length - 1;
        if (numberTag) {
            this.setState({itemsObj : Array.apply(null, new Array(numberTag)).map(() => Array.apply(null, new Array(0)))}, ()=> {console.log(this.state.itemsObj)})
        }
        let newContent = this.props.content;
        const content = [];
        let countCode = 0;
        let countBlock = 0;
        let isInCode;
        let match = newContent.match(/(\\br)|(\\tab)|({})|(``)/);
        while (match) {
            if (match[0] === '\\br') {
                isInCode = (countCode % 2 === 0) ? false : true;
                content.push({content: newContent.slice(0, match.index), type: 'br', isInCode});
                newContent = newContent.slice(match.index + 3);            
            } else if (match[0] === '\\tab') {
                isInCode = (countCode % 2 === 0) ? false : true;
                content.push({content: newContent.slice(0, match.index), type: 'tab', isInCode});
                newContent = newContent.slice(match.index + 4);
            } else if (match[0] === '{}') {
                isInCode = (countCode % 2 === 0) ? false : true;
                content.push({content: newContent.slice(0, match.index), type: 'block', index: countBlock, isInCode});
                newContent = newContent.slice(match.index + 2);
                countBlock++;
            } else if (match[0] === '``') {
                isInCode = (countCode % 2 === 0) ? false : true;
                content.push({content: newContent.slice(0, match.index), type: 'code', index: countCode, isInCode});
                newContent = newContent.slice(match.index + 2);
                countCode++;
            } else {
                throw new Error('pas de match')
            }
            match = newContent.match(/(\\br)|(\\tab)|({})|(``)/);
        }
        isInCode = (countCode % 2 === 0) ? false : true;
        content.push({content: newContent, isInCode});
        this.setState({content}, () => {
            console.log(this.state.content);
        })
    }

    componentDidUpdate() {
        this.render()
    }

     reorder (start, end) {
        const itemsObj = this.state.itemsObj;
        const items = this.state.items;
        if (end.droppableId !== "droppable") {
            const index = parseInt(end.droppableId.slice(9));
            if ((itemsObj[index]).length) {
                return;
            }
        }
        let item = null;
        if (start.droppableId === "droppable") {
            [item] = items.splice(start.index, 1);
        } else {
            const index = parseInt(start.droppableId.slice(9));
            [item] = itemsObj[index].splice(start.index, 1);
        }

        if (end.droppableId === "droppable") {
            items.splice(end.index, 0, item);
        } else {
            const index = parseInt(end.droppableId.slice(9));
            itemsObj[index].splice(end.index, 0, item);
            console.log(item, itemsObj)
        }
        this.setState({items, itemsObj}, () => {
            this.render();
        });
    }

    getListStyle(isDraggingOver) {
        return {
        background: isDraggingOver ? "lightblue" : "lightgrey",
        padding: 10,
        width: 250,
        display: "inline-block"
      };
    }

    onDragEnd(result) {
        // dropped outside the list
        console.log(result)
        if (!result.destination) {
          return;
        }
    
        this.reorder(
          result.source,
          result.destination
        );
    }
    getItemStyle(isDragging, draggableStyle) {
        return {
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        border: "1px solid black",
        marginBottom:10,
        display: "block",
      
        // change background colour if dragging
        background: isDragging ? "lightgreen" : "grey",
      
        // styles we need to apply on draggables
        ...draggableStyle
        };
    }

    tab (content) {
        let stringToReturn = content.trim();
        let nbToReturn = 0;
        while (stringToReturn.slice(0, 4) === '\\tab') {
            stringToReturn = stringToReturn.slice(4);
            nbToReturn++;
        }
        return{
            content: stringToReturn,
            nb: nbToReturn
        }
    }

    addBlock(content:string, indexString: number, oldCount: number): React.ReactNode {
        const newArray = content.split('{}');
        const newContent = newArray.map((elem, index) => {
            /* if (oldCount % 2 === 1 && index === 0) {
                return <span></span>
            } */
            if (index === newArray.length -1) {
                return <span key={indexString +index}>{elem}</span>
            }
            return (<span className="boardContentBlock" key={indexString +index}><span>{elem}</span>
                <Droppable droppableId={"droppable"+index}>
                    {(DroppableProvided, DroppableStateSnapshot) => (
                        <span {...DroppableProvided.droppableProps} ref={DroppableProvided.innerRef} style={this.getListStyle(DroppableStateSnapshot.isDraggingOver)}>
                        {this.state.itemsObj[index] ? this.state.itemsObj[index].map((child, index2) => {
                            return (<Draggable draggableId={"draggableObj"+index+index2} index={index2} key={""+index2}>
                                {(DraggableProvided, DraggableStateSnapshot, DraggableRubric) => {
                                    return<span {...DraggableProvided.draggableProps} {...DraggableProvided.dragHandleProps} ref={DraggableProvided.innerRef} style={this.getItemStyle(
                                        DraggableStateSnapshot.isDragging,
                                        DraggableProvided.draggableProps.style
                                    )}>{child}</span>
                                }}
                            </Draggable>)
                        }) : null}
                        {DroppableProvided.placeholder}
                        </span>
                    )}
                </Droppable>
            </span>);

        })
        return newContent;
    }

    styledBackGroundCode (content) {
        const styleBackGround = {
            backgroundColor: 'lightblue'
        };
        const contentArray = content.split('``');
        if (contentArray.length === 1 && this.state.booleanForStyledBackGroundCode) {
            return <span style={styleBackGround}>{contentArray[0]}</span>
        } else if (contentArray.length % 2 === 0 && !this.state.booleanForStyledBackGroundCode) {
            this.setState({booleanForStyledBackGroundCode: !this.state.booleanForStyledBackGroundCode})
            contentArray.map((ele, index) => {
                if (index % 2 === 0) {
                    return <span style={styleBackGround}>{ele}</span>
                } else {
                    return ele
                }
            })
        } else if (contentArray.length % 2 === 0 && this.state.booleanForStyledBackGroundCode) {
            this.setState({booleanForStyledBackGroundCode: !this.state.booleanForStyledBackGroundCode})
            contentArray.map((ele, index) => {
                if (index % 2 === 1) {
                    return <span style={styleBackGround}>{ele}</span>
                } else {
                    return ele
                }
            })
        } else if (contentArray.length % 2 === 1 && !this.state.booleanForStyledBackGroundCode) {
            contentArray.map((ele, index) => {
                if (index % 2 === 0) {
                    return <span style={styleBackGround}>{ele}</span>
                } else {
                    return ele
                }
            })
        } else if (contentArray.length % 2 === 0 && this.state.booleanForStyledBackGroundCode) {
            contentArray.map((ele, index) => {
                if (index % 2 === 1) {
                    return <span style={styleBackGround}>{ele}</span>
                } else {
                    return ele
                }
            })
        }
    }

    async exec() {    
        const content = document.querySelector('.ant-tabs-tabpane-active .boardContent') as HTMLElement || document.querySelector('.boardContent') as HTMLElement;
        const code = content.innerText;
        if (this.props.execute === 'noCode' || (this.props.execute === 'code' && eval(code) === eval(this.props.stepCondition))) {
            if (this.props.step) {
                let token = localStorage.getItem('steps');
                if (!token) {
                    const getToken = await axios({
                        method: 'GET',
                        url: '/tokenSteps/getToken'
                    });

                    token = getToken.data;
                    localStorage.setItem('steps', token);
                }
                const getNewToken = await axios({
                    method: 'GET',
                    url: '/tokenSteps/changeToken',
                    params: {
                        token,
                        step: this.props.step
                    }
                });
                const newToken = getNewToken.data;
                localStorage.setItem('steps', newToken);
            }
            return Antd.message.success(this.props.message);
        } else {
            return Antd.message.error('Réessayez');
        }
    }

    render(): ReactNode {
        const buttonStyle = {
            color: "black"
        };
        return (
        <div className="board">
            <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
                <Droppable droppableId="droppable">
                    {(DroppableProvided, DroppableStateSnapshot) => (
                        <div {...DroppableProvided.droppableProps} ref={DroppableProvided.innerRef} style={this.getListStyle(DroppableStateSnapshot.isDraggingOver)}>
                        {this.state.items.map((child, index) => {
                            return (<Draggable draggableId={"draggable"+index} index={index} key={""+index}>
                                {(DraggableProvided, DraggableStateSnapshot, DraggableRubric) => {
                                    return<span {...DraggableProvided.draggableProps} {...DraggableProvided.dragHandleProps} ref={DraggableProvided.innerRef} style={this.getItemStyle(
                                        DraggableStateSnapshot.isDragging,
                                        DraggableProvided.draggableProps.style
                                    )}>{child}</span>
                                }}
                            </Draggable>)
                        })}
                        {DroppableProvided.placeholder}
                        </div>
                    )}
                </Droppable>
                <div className="outerBorder">
                    <div className="innerBorder">
                        <h2 className="boardTitle">{this.props.title}</h2>
                        <div className="boardContent">
                            <p className="paraphContent">
                            {this.state.content.map((ele, indexC, contentArray) => {
                                if (indexC === contentArray.length -1) {
                                    return <span style={{backgroundColor: ele.isInCode ? 'blue': 'transparent'}} key={'lineContent'+indexC}>{ele.content}</span>
                                }
                                if (ele.type === 'br') {
                                    return <span style={{backgroundColor: ele.isInCode ? 'blue': 'transparent'}} key={'lineContent'+indexC}>{ele.content}<br/><br/></span>
                                }
                                if (ele.type === 'tab') {
                                    return <span style={{backgroundColor: ele.isInCode ? 'blue': 'transparent'}} key={'lineContent'+indexC}>{ele.content}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                }
                                if (ele.type === 'block') {
                                    return (<span style={{backgroundColor: ele.isInCode ? 'blue': 'transparent'}} key={'lineContent'+indexC}>{ele.content}
                                        <Droppable droppableId={"droppable"+ele.index}>
                                                {(DroppableProvided, DroppableStateSnapshot) => {
                                                    return (
                                                    <span {...DroppableProvided.droppableProps} ref={DroppableProvided.innerRef} style={this.getListStyle(DroppableStateSnapshot.isDraggingOver)}>
                                                    {(() => {
                                                    if (this.state.itemsObj[ele.index]) {
                                                        return (this.state.itemsObj[ele.index].map((child, index2) => {
                                                            return (<Draggable draggableId={"draggableObj"+ele.index+index2} index={index2} key={""+index2}>
                                                                {(DraggableProvided, DraggableStateSnapshot, DraggableRubric) => {
                                                                    return (<span {...DraggableProvided.draggableProps} {...DraggableProvided.dragHandleProps} ref={DraggableProvided.innerRef} style={this.getItemStyle(
                                                                        DraggableStateSnapshot.isDragging,
                                                                        DraggableProvided.draggableProps.style
                                                                    )}>{child}</span>)
                                                                }}
                                                            </Draggable>)
                                                    }))}})()}
                                                    {DroppableProvided.placeholder}
                                                    </span>
                                                )}}
                                            </Droppable>
                                    </span>)
                                }
                                if (ele.type === 'code') {
                                    return <span style={{backgroundColor: ele.isInCode ? 'blue': 'transparent'}}  key={'lineContent'+indexC}>{ele.content}</span>
                                }
                            })}
                            </p>
                        </div>
                        {this.props.execute ? <button onClick={this.exec.bind(this)} style={buttonStyle}>{this.props.execute === 'code' ? 'éxécuter le code' : 'OK' }</button> : null}
                    </div>
                </div>
            </DragDropContext>
        </div>);
    }
}

export default Board;