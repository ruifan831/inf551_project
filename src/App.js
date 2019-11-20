import React, { Component } from 'react';
import './App.css';
import * as firebase from "firebase/app";

import Config from './configuer';
import { Button, Icon,Input,Table,Checkbox,Layout,Menu,Slider,Drawer,Popover} from 'antd';


class App extends Component {
  constructor(){
    super()
  
    this.app = firebase.initializeApp(Config)
    this.state ={
      clubKeyWord:"Enter The Club:",
      players:[],
      database:firebase.database(),
      current_page:0,
      next_page:1,
      pageSize:15,
      rateRange:[0,100],
      sortByAgeAc:false,
      sortByAgeDe:false,
      searchByClub:false,
      searchByOverall:false,
      sortByWorkRateDe:false,
      sortByWorkRateAc:false,
      visible:false,
      lastplayer:null,
      lastPlayerKey:null,
      selection:["ID","Name","Age","Overall","Club","Wage","Position","Work Rate"]
  };
    const playerRef= this.state.database.ref("players").orderByChild("ID").limitToFirst(this.state.pageSize);
    playerRef.on('value',snap=>{
      var tempPlayers=[]
      snap.forEach((childSnap)=>{
          var playerInfo = childSnap.val();
          playerInfo["Work Rate"] = playerInfo["Work Rate"].slice(1);
        playerInfo.key=playerInfo.ID
        tempPlayers.push(playerInfo)
      });
      if (tempPlayers.length){
        this.setState({
        players : this.state.players.concat(tempPlayers),
        lastplayer:tempPlayers[tempPlayers.length-1],
        columns:Object.keys(tempPlayers[0])
      })
      } else {
        alert("Database Empty")
      }
      
    });
  }
  
 
  handleChange = (event) => {
      this.setState({ clubKeyWord: event.target.value });
      console.log(this.state.clubKeyWord)
    }

  sortWorkRateHandelerAc = () => {
    const playerRef= this.state.database.ref("players").orderByChild("Work Rate").limitToFirst(this.state.pageSize);
    playerRef.on('value',snap=>{
      var valArr1=[]
      snap.forEach((childSnap)=>{
          var playerInfo = childSnap.val();
          playerInfo["Work Rate"] = playerInfo["Work Rate"].slice(1);
        playerInfo.key=playerInfo.ID
        valArr1.push(playerInfo)
      });
      valArr1.sort(function (x,y){
        if (x["Work Rate"]>y["Work Rate"]){
          return 1;
        }
        if (x["Work Rate"]<y["Work Rate"]){
          return -1;
        }
        return 0
      })
      if (valArr1.length){
        this.setState({
        players :valArr1,
        sortByAgeAc:false,
        sortByAgeDe:false,
        searchByClub:false,
        searchByOverall:false,
        sortByWorkRateDe:false,
        sortByWorkRateAc:true,
        lastplayer:valArr1[valArr1.length-1],
        lastPlayerKey:(valArr1[valArr1.length-1].ID+1).toString()
        })
      } else{
        alert("Error !")
      }
      
    });
  }

  sortWorkRateHandelerDe = () => {
    const playerRef = this.state.database.ref("players").orderByChild("Work Rate").limitToLast(this.state.pageSize);
    playerRef.on('value',snap=>{
      var valArr1=[]
      snap.forEach((childSnap)=>{
          var playerInfo = childSnap.val();
          playerInfo["Work Rate"] = playerInfo["Work Rate"].slice(1);
        playerInfo.key=playerInfo.ID
        valArr1.push(playerInfo)
      });
      valArr1.sort(function (x,y){
        if (x["Work Rate"]<y["Work Rate"]){
          return 1;
        }
        if (x["Work Rate"]>y["Work Rate"]){
          return -1;
        }
        return 0
      })
      if (valArr1.length){
        this.setState({
        players :valArr1,
        sortByAgeAc:false,
        sortByAgeDe:false,
        searchByClub:false,
        searchByOverall:false,
        sortByWorkRateDe:true,
        sortByWorkRateAc:false,
        lastplayer:valArr1[valArr1.length-1],
        lastPlayerKey:(valArr1[valArr1.length-1].ID-1).toString()
        })
      } else {
        alert("Error !")
      }
      
    });
  }

  sortAgeHandlerAc = ()=>{
    const playerRef= this.state.database.ref("players").orderByChild("Age").limitToFirst(this.state.pageSize);
    console.log("Sort By age in ac order")
    playerRef.on('value',snap=>{
      var valArr=[]
      snap.forEach((childSnap)=>{
          var playerInfo = childSnap.val();
          playerInfo["Work Rate"] = playerInfo["Work Rate"].slice(1);
        playerInfo.key=playerInfo.ID
        valArr.push(playerInfo)
      });
      valArr.sort(function (x,y){
        if (x.Age<y.Age){
          return -1;
        }
        if (x.Age>y.Age){
          return 1;
        }
        return 0
      })
      var tempList=valArr.filter(function(x){
        return x.Age ===valArr[valArr.length-1].Age
      })
      tempList.sort(function(x,y){
        if (x.ID>y.ID){
          return 1
        }
        if (x.ID<y.ID){
          return -1
        }
        return 0
      })
      if (valArr.length){
        this.setState({
        players :valArr,
        sortByAgeAc:true,
        sortByAgeDe:false,
        searchByClub:false,
        searchByOverall:false,
        sortByWorkRateDe:false,
        sortByWorkRateAc:false,
        lastplayer:tempList[tempList.length-1],
        lastPlayerKey:(tempList[tempList.length-1].ID+1).toString(),
        current_page:0,
        next_page:1,
        })
        console.log(this.state.lastPlayerKey)
      } else{
        alert("Error")
      }
      
    });
  }

  sortAgeHandlerDe = ()=>{
    const playerRef= this.state.database.ref("players").orderByChild("Age").limitToLast(this.state.pageSize);
    playerRef.on('value',snap=>{
      console.log(Object.keys(snap.val()))
      var valArr=[]
      snap.forEach((childSnap)=>{
          var playerInfo = childSnap.val();
          playerInfo["Work Rate"] = playerInfo["Work Rate"].slice(1);
        playerInfo.key=playerInfo.ID
        valArr.push(playerInfo)
      });
      // sort the array before set to state
      valArr.sort(function (x,y){
        if (x.Age<y.Age){
          return 1;
        }
        if (x.Age>y.Age){
          return -1;
        }
        return 0
      })
      var tempList=valArr.filter(function(x){
        return x.Age ===valArr[valArr.length-1].Age
      })
      tempList.sort(function(x,y){
        if (x.ID<y.ID){
          return 1
        }
        if (x.ID>y.ID){
          return -1
        }
        return 0
      })
      if (valArr.length){
        this.setState({
        players :valArr,
        sortByAgeAc:false,
        sortByAgeDe:true,
        searchByClub:false,
        searchByOverall:false,
        sortByWorkRateDe:false,
        sortByWorkRateAc:false,
        lastplayer:tempList[tempList.length-1],
        lastPlayerKey:(tempList[tempList.length-1].ID-1).toString(),
        current_page:0,
        next_page:1
      })
      console.log(this.state.lastPlayerKey)
      } else {
        alert("Error!")
      }
      
    });


  }

  changePage = ()=>{
    if (this.state.sortByAgeAc){
      const playerRef= this.state.database.ref("players").orderByChild("Age").startAt(this.state.lastplayer.Age,this.state.lastPlayerKey).limitToFirst(this.state.pageSize);
      playerRef.on('value',snap=>{
        var valArr=[]
        snap.forEach((childSnap)=>{
            var playerInfo = childSnap.val();
            playerInfo["Work Rate"] = playerInfo["Work Rate"].slice(1);
          playerInfo.key=playerInfo.ID
          valArr.push(playerInfo)
        });
        valArr.sort(function (x,y){
          if (x.Age<y.Age){
            return -1;
          }
          if (x.Age>y.Age){
            return 1;
          }
          return 0
        })
        var tempList=valArr.filter(function(x){
          return x.Age ===valArr[valArr.length-1].Age
        })
        tempList.sort(function(x,y){
          if (x.ID>y.ID){
            return 1
          }
          if (x.ID<y.ID){
            return -1
          }
          return 0
        })
        if (valArr.length){
          this.setState({
          players :this.state.players.concat(valArr),
          current_page:this.state.current_page+1,
          next_page:this.state.next_page+1,
          lastplayer:tempList[tempList.length-1],
          lastPlayerKey:(tempList[tempList.length-1].ID+1).toString()
        })
        console.log(this.state.lastPlayerKey)} else{
          alert("No more players")
        }
        
      })
    }
    else if (this.state.sortByAgeDe) {
      const playerRef= this.state.database.ref("players").orderByChild("Age").endAt(this.state.lastplayer.Age,this.state.lastPlayerKey).limitToLast(this.state.pageSize);
      playerRef.on('value',snap=>{
        var valArr=[]
        snap.forEach((childSnap)=>{
            var playerInfo = childSnap.val();
            playerInfo["Work Rate"] = playerInfo["Work Rate"].slice(1);
          playerInfo.key=playerInfo.ID
          valArr.push(playerInfo)
        });
        valArr.sort(function (x,y){
          if (x.Age<y.Age){
            return 1;
          }
          if (x.Age>y.Age){
            return -1;
          }
          return 0
        })
        var tempList=valArr.filter(function(x){
          return x.Age ===valArr[valArr.length-1].Age
        })
        tempList.sort(function(x,y){
          if (x.ID<y.ID){
            return 1
          }
          if (x.ID>y.ID){
            return -1
          }
          return 0
        })
        if (valArr.length){
          this.setState({
          players :this.state.players.concat(valArr),
          current_page:this.state.current_page+1,
          next_page:this.state.next_page+1,
          lastplayer:tempList[tempList.length-1],
          lastPlayerKey:(tempList[tempList.length-1].ID-1).toString()
        })
        console.log(this.state.lastPlayerKey)
      } else{
        alert("No more players")
      }
        
      })
    }
    else if (this.state.searchByClub) {
      console.log("HERE")
      const playerRef= this.state.database.ref("players").orderByChild("Club").equalTo(this.state.clubKeyWord,this.state.lastPlayerKey).limitToLast(this.state.pageSize);
      playerRef.on('value',snap=>{
        var tempPlayers=[]
        snap.forEach((childSnap)=>{
            var playerInfo = childSnap.val();
            playerInfo["Work Rate"] = playerInfo["Work Rate"].slice(1);
          playerInfo.key=playerInfo.ID
          tempPlayers.push(playerInfo)
        })
          tempPlayers.sort()
          console.log(tempPlayers.length)
        if (tempPlayers.length){
          this.setState({
            players:this.state.players.concat(tempPlayers),
            lastplayer:tempPlayers[tempPlayers.length-1],
            lastPlayerKey:(tempPlayers[tempPlayers.length-1].ID+1).toString(),
            current_page:this.state.current_page+1,
            next_page:this.state.next_page+1 
          })
        } else {
          alert("All Players in selected Club has been showed")
        }
      })
    }
    else if (this.state.sortByWorkRateDe) {
        var temp = "";
        if (this.state.lastplayer["Work Rate"].startsWith("Low")) {
            temp = "1" + this.state.lastplayer["Work Rate"]
        } else if (this.state.lastplayer["Work Rate"].startsWith("Medium")) {
            temp = "2" + this.state.lastplayer["Work Rate"]
        } else if (this.state.lastplayer["Work Rate"].startsWith("High")) {
            temp = "3" + this.state.lastplayer["Work Rate"]
        } else {
            temp="4"
        }
      const playerRef= this.state.database.ref("players").orderByChild("Work Rate").endAt(temp,this.state.lastPlayerKey).limitToLast(this.state.pageSize);
      playerRef.on('value',snap=>{
        var valArr=[]
        snap.forEach((childSnap)=>{
            var playerInfo = childSnap.val();
            playerInfo["Work Rate"] = playerInfo["Work Rate"].slice(1);
          playerInfo.key=playerInfo.ID
          valArr.push(playerInfo)
        });
        // var tempList=valArr.filter(function(x){
        //   return x.Age ===valArr[valArr.length-1].Age
        // })
        valArr.sort(function(x,y){
          if (x.ID<y.ID){
            return 1
          }
          if (x.ID>y.ID){
            return -1
          }
          return 0
        })
        if (valArr.length){
          this.setState({
          players :this.state.players.concat(valArr),
          current_page:this.state.current_page+1,
          next_page:this.state.next_page+1,
          lastplayer:valArr[valArr.length-1],
          lastPlayerKey:(valArr[valArr.length-1].ID+1).toString()
        })
          console.log(this.state.lastPlayerKey)
        } else{
          alert("No more players")
        }
        
      })

    }
    else if (this.state.sortByWorkRateAc) {
        var temp1 = "";
        if (this.state.lastplayer["Work Rate"].startsWith("Low")) {
            temp1 = "1" + this.state.lastplayer["Work Rate"]
        } else if (this.state.lastplayer["Work Rate"].startsWith("Medium")) {
            temp1= "2" + this.state.lastplayer["Work Rate"]
        } else if (this.state.lastplayer["Work Rate"].startsWith("High")) {
            temp1 = "3" + this.state.lastplayer["Work Rate"]
        } else {
            temp1 = "4"
        }
      const playerRef= this.state.database.ref("players").orderByChild("Work Rate").startAt(temp1,this.state.lastPlayerKey).limitToFirst(this.state.pageSize);
      playerRef.on('value',snap=>{
        var valArr1=[]
        snap.forEach((childSnap)=>{
            var playerInfo = childSnap.val();
            playerInfo["Work Rate"] = playerInfo["Work Rate"].slice(1);
          playerInfo.key=playerInfo.ID
          valArr1.push(playerInfo)
        });
        valArr1.sort(function (x,y){
          if (x["Work Rate"]>y["Work Rate"]){
            return 1;
          }
          if (x["Work Rate"]<y["Work Rate"]){
            return -1;
          }
          return 0
        })
        if (valArr1.length){
          this.setState({
            players :this.state.players.concat(valArr1),
            lastplayer:valArr1[valArr1.length-1],
            lastPlayerKey:(valArr1[valArr1.length-1].ID+1).toString(),
            current_page: this.state.current_page+1,
            next_page:this.state.next_page+1,
          })
          console.log("After next page",this.state.lastPlayerKey)
        } else {
          alert("No more players")
        }
        
      });

    }
    else if (this.state.searchByOverall) {
      const playerRef= this.state.database.ref("players").orderByChild("Overall").startAt(this.state.rateRange[0]).endAt(this.state.rateRange[1],this.state.lastPlayerKey).limitToLast(this.state.pageSize);
      playerRef.on('value',snap=>{
        var valArr=[]
        snap.forEach((childSnap)=>{
            var playerInfo = childSnap.val();
            playerInfo["Work Rate"] = playerInfo["Work Rate"].slice(1);
          playerInfo.key=playerInfo.ID
          valArr.push(playerInfo)
        });
        valArr.sort(function (x,y){
          if (x.Overall<y.Overall){
            return 1;
          }
          if (x.Overall>y.Overall){
            return -1;
          }
          return 0
        })
        var tempList=valArr.filter(function(x){
          return x.Overall ===valArr[valArr.length-1].Overall
        })
        // sort players by their ID in Desending order
        tempList.sort(function(x,y){
          if (x.ID<y.ID){
            return 1
          }
          if (x.ID>y.ID){
            return -1
          }
          return 0
        })
        if (valArr.length){
          this.setState({
              players: this.state.players.concat(valArr),
              lastplayer:tempList[tempList.length-1],
              lastPlayerKey: (tempList[tempList.length - 1].ID - 1).toString(),
              current_page: this.state.current_page+1,
              next_page:this.state.next_page+1,
              rateRange:[this.state.rateRange[0],tempList[tempList.length-1].Overall]
        })}else{
          alert("No more player")
        }    
      })
      
    }
    else {
        const playerRef= this.state.database.ref("players").orderByChild("ID").startAt(this.state.lastplayer.ID+1).limitToFirst(this.state.pageSize);
        playerRef.on('value',snap=>{
          var valArr=[]
          snap.forEach((childSnap)=>{
              var playerInfo = childSnap.val();
              playerInfo["Work Rate"] = playerInfo["Work Rate"].slice(1);
            playerInfo.key=playerInfo.ID
            valArr.push(playerInfo)
          });
          // Sort by ID in ascending order
          valArr.sort(function(x,y){
            if (x.ID>y.ID){
              return 1
            }
            if (x.ID<y.ID){
              return -1
            }
            return 0
          })
          this.setState({
            players : this.state.players.concat(valArr),
            lastplayer:valArr[valArr.length-1],
            lastPlayerKey: (valArr[valArr.length - 1].ID + 1).toString(),
            current_page:this.state.current_page+1,
            next_page:this.state.next_page+1
          })
          console.log(this.state.lastplayer.ID)
        });
      }
  }
  
  changePageToFront = () =>{
    let tempPlayers=this.state.players.slice(0,this.state.current_page*this.state.pageSize);
    console.log(tempPlayers[tempPlayers.length-1])
    this.setState({
        players:tempPlayers,
        lastplayer:tempPlayers[tempPlayers.length-1],
        lastPlayerKey:(tempPlayers[tempPlayers.length-1].ID+1).toString(),
        current_page:this.state.current_page-1,
        next_page:this.state.next_page-1
      })
  }

  searchByKeyWord = (val) => {
    console.log(val)
    const playerRef = this.state.database.ref("players").orderByChild("Club").equalTo(val).limitToLast(this.state.pageSize);
    playerRef.on('value',snap=>{
      var tempPlayers=[]
      snap.forEach((childSnap)=>{
          var playerInfo = childSnap.val();
          playerInfo["Work Rate"] = playerInfo["Work Rate"].slice(1);
        playerInfo.key=playerInfo.ID
        tempPlayers.push(playerInfo)
      });
        tempPlayers.sort(function (x, y) {
            if (x.ID > y.ID) {
                return 1
            }
            if (x.ID < y.ID) {
                return -1
            }
            return 0
        }
        )
      if (tempPlayers.length){
        this.setState({
          players :tempPlayers,
          sortByAgeAc:false,
          sortByAgeDe:false,
          searchByClub:true,
          searchByOverall:false,
          sortByWorkRateDe:false,
          sortByWorkRateAc:false,
          lastplayer:tempPlayers[tempPlayers.length-1],
          lastPlayerKey:(tempPlayers[tempPlayers.length-1].ID+1).toString(),
          current_page:0,
          next_page:1})
        console.log(this.state.lastPlayerKey)
      } else {
        alert("No such Club")
      }
    })
  }

  checkedSelection = (checkedValue) =>{
    this.setState({selection:checkedValue})
  }

  searchByOverall=(value)=>{
    const playerRef= this.state.database.ref("players").orderByChild("Overall").startAt(value[0]).endAt(value[1]).limitToLast(this.state.pageSize);
    playerRef.on('value',snap=>{
      
      var valArr=[]
      snap.forEach((childSnap)=>{
          var playerInfo = childSnap.val();
          playerInfo["Work Rate"] = playerInfo["Work Rate"].slice(1);
        playerInfo.key=playerInfo.ID
        valArr.push(playerInfo)
      });
      valArr.sort(function (x,y){
        if (x.Overall<y.Overall){
          return 1;
        }
        if (x.Overall>y.Overall){
          return -1;
        }
        return 0
      })
      var tempList=valArr.filter(function(x){
        return x.Overall ===valArr[valArr.length-1].Overall
      })
      tempList.sort(function(x,y){
        if (x.ID<y.ID){
          return 1
        }
        if (x.ID>y.ID){
          return -1
        }
        return 0
      })
      if (valArr.length){
        this.setState({
          players :valArr,
          sortByAgeAc:false,
          sortByAgeDe:false,
          searchByClub:false,
          searchByOverall:true,
          sortByWorkRateDe:false,
          sortByWorkRateAc:false,
          lastplayer:tempList[tempList.length-1],
          lastPlayerKey:(tempList[tempList.length-1].ID-1).toString(),
          current_page:0,
          next_page:1,
          rateRange:[value[0],tempList[tempList.length-1].Overall]
      })} else{
        alert("No such player")
      }
      
    })
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };


  render(){
    // var playerDom =null
    // if (this.state.players){
    //   playerDom=<Players players={this.state.players} startPage={this.state.current_page} endPage={this.state.next_page}></Players>;
    // }
    const ButtonGroup = Button.Group;
      const { Search } = Input;
      const selectColumn = (
          <div>
              <p>Select Attributes to Show In Table</p>
          </div>)
    var previousButton= null
    if (this.state.current_page !== 0){
      previousButton=(<Button type="primary" onClick={()=>this.changePageToFront()}>
        <Icon type="left" />
        Previous Page
        </Button>)
    }
    const menu=<Checkbox.Group options={this.state.columns} defaultValue={this.state.selection} onChange={checked=>this.checkedSelection(checked)}/>
      var tableColumn = this.state.selection.map(x => {
          return ({
            title:x,
            dataIndex:x,
            key:x,
            align:"center"
          })
    })
    
    return (
        <div className="App">
            <Layout className="layout">
                <Layout.Header className="header" >
            <div className="logo" ></div>
            <h1 style={{color:"white"}}>FIFA 19 complete player dataset</h1>
            {/* <h2>18k+ FIFA 19 players, ~90 attributes extracted from the latest FIFA database</h2> */}
                </Layout.Header>
                <Layout>
                    <Layout.Sider width={200} style={{ background: '#fff' }}>
              <div>
                <Menu style={{ height: '100%', borderRight: 0 }} defaultSelectedKeys={['1']} mode="inline">
                  <Menu.Item key="1">
                    <span><Button  block onClick={()=>this.sortAgeHandlerAc()} type="link">Sort By Age <Icon type="up-square" theme="twoTone" twoToneColor="#52c41a" /></Button></span>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <span><Button  block onClick={()=>this.sortAgeHandlerDe()} type="link">Sort By Age <Icon type="down-square" theme="twoTone" twoToneColor="#52c41a" /></Button></span>
                  </Menu.Item>
                  <Menu.Item key="3">
                    <span><Button  block onClick={()=>this.sortWorkRateHandelerAc()} type="link">Sort By Work Rate <Icon type="up-square" theme="twoTone" twoToneColor="#52c41a" /></Button></span>
                  </Menu.Item>
                  <Menu.Item key="4">
                    <span><Button  block onClick={()=>this.sortWorkRateHandelerDe()} type="link">Sort By Work Rate <Icon type="down-square" theme="twoTone" twoToneColor="#52c41a" /></Button></span>
                  </Menu.Item>
                </Menu>
              </div>
            </Layout.Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
              <Layout.Content style={{background: '#fff',padding: 24,margin: 0,minHeight: 280,}}>
                            <div>
                                <Popover content={selectColumn}>       
                                      <Button type="primary" onClick={this.showDrawer}>
                                        Open
                                      </Button>
                                </Popover>
                  <Drawer
                      title="Attributes Selection"
                      placement="right"
                      closable={false}
                      onClose={this.onClose}
                      visible={this.state.visible}
                    >{menu}</Drawer>
                  <Search 
                    placeholder="Search By Club Name" 
                    style={{ width: 300 }}
                    onSearch={value =>this.searchByKeyWord(value)}
                    onChange={value=>this.handleChange(value)} enterButton />
                  <Slider
                    range
                    step={1}
                    defaultValue={[0, 100]}
                    onAfterChange={this.searchByOverall}
                  />
                </div>               
                <Table       
                  bordered 
                  dataSource={this.state.players.slice(this.state.current_page*this.state.pageSize,this.state.next_page*this.state.pageSize)}
                  columns={tableColumn}
                  pagination={
                    {
                      pageSize: this.state.pageSize,
                      hideOnSinglePage:true}
                  }
                  // scroll={{y: window.innerHeight*0.8 }}
                />
                <ButtonGroup>
                  {previousButton}
                  <Button type="primary" onClick={()=>this.changePage()}>
                    Next Page
                    <Icon type="right" />
                  </Button>
                </ButtonGroup>
              </Layout.Content>
              <Layout.Footer style={{ textAlign: 'center' }}>
                <div>
                    <span>© 2019 Kaggle Inc</span>
                </div>
              </Layout.Footer>
            </Layout>
          </Layout>
        </Layout>
        </div>
    );
    // return React.createElement('div',{className: "App"},React.createElement("h1",null,"Hi"))
  }
}

export default App;
