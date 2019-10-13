import React from 'react';
import View from './Component/View';

const data = [
  {
      name: "Small File",
      type: "file",
      created: "05-05-1999",
  },
  {
      name:"Folder",
      type: "folder",
      created: "01-01-2019",
      files: [
          {
              name: "SmallFolder",
              type: "file",
              created: "05-05-1999",
          }
      ]
  },
  {
    name: "Big folder ",
    type: "folder",
    created: "11-11-2019",
    files: [
      {
        name: "SmallFolder",
        type: "folder",
        created: "01-05-1999",
        files: [
        { name: "DocFile",
          type: "file",
          created: "02-05-1998"
        },
        { name: "DocFile2",
          type: "file",
          created: "03-05-2000"
        }
        ]
      },
      {
        name: "SmallFolder",
        type: "folder",
        created: "04-06-1999",
        files: [
        { name: "DocFile3",
          type: "file",
          created: "05-05-1999"
        },
        { name: "DocFile4",
          type: "file",
          created: "06-11-1999"
        }
        ]
      },
      {
        name: "SmallFolder",
        type: "folder",
        created: "07-05-2010",
        files: [
        { name: "DocFile5",
          type: "file",
          created: "08-05-2008",
        },
        { name: "DocFile6",
          type: "file",
          created: "09-05-2009"
        }
        ]
      }
    ]
  },
  {
    name: "Big folder 2",
    type: "folder",
    created: "10-01-1999",
    files: [
      {
        name: "SmallFolder",
        type: "folder",
        created: "11-05-2019",
        files: [
        { name: "DocFile",
          type: "file",
          created: "12-05-1899",
        },
        { name: "DocFile2",
          type: "file",
          created: "13-05-1989",
        }
        ]
      },
      {
        name: "SmallFolder",
        type: "folder",
        created: "14-09-1999",
        files: [
        { name: "DocFile3",
          type: "file",
          created: "15-01-2000",
          files: [
            { name: "DocFile9",
              type: "file",
              created: "15-12-2001",
            },
            { name: "DocFile8",
            type: "file",
            created: "13-12-2013",
            }
          ]
        },
        { name: "DocFile4",
          type: "file",
          created: "16-10-2001",
        }
        ]
      },
      {
        name: "SmallFolder",
        type: "folder",
        created: "17-10-2016",
        files: [
        { name: "DocFile5",
          type: "file",
          created: "18-09-2009"
        },
        { name: "DocFile6",
          type: "file",
          created: "19-07-2007",
        }
        ]
      }
    ]
  }
]

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      data: []
    }
  }

  componentDidMount(){
    this.setState({data: data})
  }


  render(){
    return(
      <View data={this.state.data}/>
    )
  }
}
export default App