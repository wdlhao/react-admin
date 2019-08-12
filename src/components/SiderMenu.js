/**
  1级菜单和2级菜单，dom渲染流程分析：
  <Menu {...props}>
        {item.subs ? renderSubMenu(item) : renderMenuItem(item)}
    </Menu>
  主要是通过item.sub来判断是否有2级菜单，并进行相应的方法加载；
  {item.subs.map(item => renderMenuItem(item))}，如果有2级菜单的数据，再通过map循环1级菜单方法。


  2.react-beautiful-dnd：拖拽插件的学习
  示例：import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

  3.useState？
  示例：import { useState } from 'react';







 * 
 * 
 */
import React, { useState } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

/**
  只有1级菜单，渲染该函数；
  <Menu.Item key={item.key}>
     <Link to={path}>
        <span>{name}</span>
     </Link>
  </Menu.Item>
 */
const renderMenuItem = item => ( // item.route 菜单单独跳转的路由
    <Menu.Item
        key={item.key}
    >
        <Link to={(item.route || item.key) + (item.query || '')}>
            {item.icon && <Icon type={item.icon} />}
            <span className="nav-text">{item.title}</span>
        </Link>
    </Menu.Item>
);
/**
  如果有2级菜单，渲染该函数；
    <Menu>
        <Menu.SubMenu key={key} title={html}>
            <Menu.Item key={key}>
                <Link to={path}>
                    <span>{name}</span>
                </Link>
            </<Menu.Item>
        </Menu.SubMenu>
    </Menu>
 */

const renderSubMenu = item => (
    <Menu.SubMenu
        key={item.key}
        title={
            <span>
                {item.icon && <Icon type={item.icon} />}
                <span className="nav-text">{item.title}</span>
            </span>
        }
    >
        {item.subs.map(item => renderMenuItem(item))}
    </Menu.SubMenu>
);

// React Hooks:可以使用函数来写组件;
export default ({ menus, ...props }) => {
    // userState(menus),如何理解？
    const [dragItems, setDragItems] = useState(menus); 
    // console.log(dragItems); // 路由配置数组；
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };
    const onDragEnd = (result) => {
        // dropped outside the list
        if(!result.destination) {
           return;
        }

        const _items = reorder(
            dragItems,
            result.source.index,
            result.destination.index
        );
        setDragItems(_items);
    }
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {dragItems.map((item, index) => (
                            <Draggable
                                key={item.key}
                                draggableId={item.key}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <div>
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.dragHandleProps}
                                            {...provided.draggableProps}
                                        >
                                            <Menu {...props}>
                                                {item.subs ? renderSubMenu(item) : renderMenuItem(item)}
                                            </Menu>
                                        </div>
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}