import React from 'react';
import Context from './context';
import { bindActionCreators} from 'redux'; 
let connect = (mapStateToProps, mapDipsatchToProps)=> (Component)=>{
  return ()=>{
    class Proxy extends React.Component{
      state = mapStateToProps(this.props.store.getState());
      componentDidMount(){
        this.unsub = this.props.store.subscribe(()=>{
          this.setState(mapStateToProps(this.props.store.getState()))
        })
      }
      componentWillUnmount(){
        this.unsub();
      }
      render(){
        let mapDispatch;
        if (typeof mapDipsatchToProps === 'object'){ //如果第二个参数传递的是一个对象，把对象直接进行包装即可
          mapDispatch = bindActionCreators(mapDipsatchToProps,this.props.store.dispatch);
        }else{
          mapDispatch = mapDipsatchToProps(this.props.store.dispatch);
        }
        return <Component {...this.state} {...mapDispatch}></Component>
      }
    }
    return <Context.Consumer>
      {({store})=>{
        // 将状态 和dispatch 拿到执行函数 把结果对象传递给原本的component渲染
        return <Proxy store={store}></Proxy>
      }}
    </Context.Consumer>
  }
}
export default connect;