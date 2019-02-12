const express =require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose')
const app = express(); 


    var workItems =[]
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine', 'ejs');


mongoose.connect("mongodb+srv://sandman2k18:Jsmooth123@cluster0-fqhdv.mongodb.net/todolistDB", {useNewUrlParser:true});

const Schema = mongoose.Schema;

const itemsSchema = new Schema({
    name: {
        type: String,
        required: true
      }
})
const Item = mongoose.model('Item', itemsSchema);

const item1 =new Item ({
name:'Welcome to your todo list'
})
 
const item2 =new Item ({
    name:'Ht the + button to add a new item'
    })

    const item3 =new Item ({
        name:'<-- Hit this to delete an item'
        })

        const defaultItems =[item1,item2,item3];


const listSchema ={
    name:String,
    items:[itemsSchema]
}
 const List=mongoose.model('List',listSchema)       

app.get('/', (req,res) =>{

Item.find({},(err,foundItems)=>{
    if(foundItems.length === 0){

        Item.insertMany(defaultItems,(err)=>{
            if(err){console.log(err)}else{
                console.log('saved')
            }
        });res.redirect('/');
    }else{res.render("list",{
        listTitle: 'Today', newListItems: foundItems
    });
    }
            

        });

   
    
});

app.post('/', (req ,res)=>{
   const itemName = req.body.newItem;

   const item =new Item({
       name:itemName
   })
   item.save();
   res.redirect('/')
})
app.post('/delete',(req,res)=>{
   const checkedItemId =req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId,(err)=>{
     if(err) {console.log(err)}else{console.log('Deleted');
     res.redirect('/')}
  })

})


app.get('/:customListName', (req,res)=>{
 const customListName=  req.params.NewList;
List.findOne({name:customListName}, (err,foundList)=>{
if(!err){
    if(!foundList){console.log('doesnt exist');const list = new List ({
     name: customListName,
     items:defaultItems
 })
 list.save()
 res.redirect('/' + customListName)
}else{console.log('doesnt exist');
res.render('list',{ listTitle: foundList.name, newListItems: foundList.items})
}
}
})
 

})

app.get('/about', (req,res)=>{
 res.render('about')
})



app.listen(  process.env.PORT ||'https://nameless-lake-29432.herokuapp.com/' , ()=>{
    console.log('Server Started')
})


