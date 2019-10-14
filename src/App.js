import React from 'react';
import View from './Component/View';

const data = [
  {
      name: "Small File",
      type: "file",
      path: "/smallfile",
      created: "05-05-1999",
      modified: "05-05-1999",
  },
  {
      name:"Folder",
      type: "folder",
      path: "/folder",
      created: "01-01-2019",
      modified: "01-01-2019",
      files: [
          {
              name: "SmallFolder",
              type: "file",
              path: "/folder/smallfolder",
              created: "05-05-1999",
              modified: "05-05-1999",
          }
      ]
  },
  {
    name: "Big folder ",
    type: "folder",
    path: "/bigfolder",
    created: "11-11-2019",
    modified: "11-11-2019",
    files: [
      {
        name: "SmallFolder",
        type: "folder",
        path: "/bigfolder/smallfolder",
        created: "01-05-1999",
        modified: "01-05-1999",
        files: [
        { name: "DocFile",
          type: "file",
          path: "/bigfolder/docfile",
          created: "02-05-1998",
          modified: "02-05-1998",
        },
        { name: "DocFile2",
          type: "file",
          path: "/bigfolder/docfile2",
          created: "03-05-2000",
          modified: "03-05-2000"
        }
        ]
      },
      {
        name: "SmallFolder",
        type: "folder",
        path: "/bigfolder/smallfolder",
        created: "04-06-1999",
        modified: "04-06-1999",
        files: [
        { name: "DocFile3",
          type: "file",
          path: "/bigfolder/smallfolder/docfile3",
          created: "05-05-1999",
          modified: "05-05-1999"
        },
        { name: "DocFile4",
          type: "file",
          path: "/bigfolder/smallfolder/docfile4",
          created: "06-11-1999",
          modified: "06-11-1999"
        }
        ]
      },
      {
        name: "SmallFolder",
        type: "folder",
        path: "/bigfolder/smallfolder",
        created: "07-05-2010",
        modified: "07-05-2010",
        files: [
        { name: "DocFile5",
          type: "file",
          path: "/bigfolder/smallfolder/docfile5",
          created: "08-05-2008",
          modified: "08-05-2008",
        },
        { name: "DocFile6",
          type: "file",
          path: "/bigfolder/smallfolder/docfile6",
          created: "09-05-2009",
          modified: "09-05-2009"
        }
        ]
      }
    ]
  },
  {
    name: "Big folder 2",
    type: "folder",
    path: "/bigfolder2",
    created: "10-01-1999",
    modified: "10-01-1999",
    files: [
      {
        name: "SmallFolder",
        type: "folder",
        path: "/bigfolder2/smallfolder",
        created: "11-05-2019",
        modified: "11-05-2019",
        files: [
        { name: "DocFile",
          type: "file",
          path: "/bigfolder2/smallfolder/docfile",
          created: "12-05-1899",
          modified: "12-05-1899",
        },
        { name: "DocFile2",
          type: "file",
          path: "/bigfolder2/smallfolder/docfile2",
          created: "13-05-1989",
          modified: "13-05-1989",
        }
        ]
      },
      {
        name: "SmallFolder",
        type: "folder",
        path: "/bigfolder2/smallfolder",
        created: "14-09-1999",
        modified: "14-09-1999",
        files: [
        { name: "DocFile3",
          type: "folder",
          path: "/bigfolder2/smallfolder/docfile3",
          created: "15-01-2000",
          modified: "15-01-2000",
          files: [
            { name: "DocFile9",
              type: "file",
              path: "/bigfolder2/smallfolder/docfile3/docfile9",
              created: "15-12-2001",
              modified: "15-12-2001",
            },
            { name: "DocFile8",
            type: "file",
            path: "/bigfolder2/smallfolder/docfile3/docfile8",
            created: "13-12-2013",
            modified: "13-12-2013",
            }
          ]
        },
        { name: "DocFile4",
          type: "file",
          path: "/bigfolder2/smallfolder/docfile9",
          created: "16-10-2001",
          modified: "16-10-2001",
        }
        ]
      },
      {
        name: "SmallFolder",
        type: "folder",
        path: "/bigfolder2/smallfolder",
        created: "17-10-2016",
        modified: "17-10-2016",
        files: [
        { name: "DocFile5",
          type: "file",
          path: "/bigfolder2/smallfolder/docfile5",
          created: "18-09-2009",
          modified: "18-09-2009"
        },
        { name: "DocFile6",
          type: "file",
          path: "/bigfolder2/smallfolder/docfile6",
          created: "19-07-2007",
          modified: "19-07-2007",
        }
        ]
      }
    ]
  }
]

const pathlink = "/bigfolder2/smallfolder/docfile6"


class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      data: []
    };
  }
  pathdirect(linkpath, i=1){
    const linkarr = linkpath.split("/") 
    var path = "/" + linkarr[i]
    var tired = data.find((dataeach)=>{ return dataeach.path === path })
    console.log(tired.files.find((item)=>{ return item.path === path + "/" + linkarr[i+1]}));

    function as(target){
      if(i<linkarr.length-1){
        i = i + 1
        path = path + "/" + linkarr[i]
        console.log(target.files.find((item)=>{ return item.path === path}))
        as(target.files.find((item)=>{ return item.path === path}))
      }else{
        console.log("end")
      } 
    }
    as(tired)
  }
  componentDidMount(){
    this.setState({data: data})
    var test = data.find((dataeach)=>{ return dataeach.path === "/bigfolder2" }).files.filter((dataeach)=>{ return dataeach.path === "/bigfolder2/smallfolder"})
    this.pathdirect(pathlink)
  }


  render(){
    return(
      <View data={this.state.data}/>
    )
  }
}
export default App