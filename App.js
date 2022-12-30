const express = require("express")
const bodyparser = require("body-parser")
const date = require(__dirname + "/date.js")
const { urlencoded } = require("body-parser")
const mongoose = require('mongoose')
const { name } = require("ejs")
const app = express()
const _ = require('lodash')

// console.log(date)
app.set("view engine", "ejs")
app.use(urlencoded({ extended: true }))
app.use(express.static("Public"))
mongoose.set('strictQuery', false)
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://admin-karan:karan123@cluster0.jlz2dno.mongodb.net/ToDoList');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// var newitem = ['Exercise','Eat Food','Do Work']
// var workitem = []




const itemSchema = new mongoose.Schema({
    Name: String
})
//List scheema
const listSchema = new mongoose.Schema({
    name: String,
    listitem: [itemSchema]

})

const list = mongoose.model('list', listSchema)

const Item = mongoose.model("Item", itemSchema)
const Eat = new Item({
    Name: "Eat-Food"
})
const Bath = new Item({
    Name: "Take-Bath"
})
const Codding = new Item({
    Name: "Codding"
})


const defultItem = [Eat, Bath, Codding]

// ----------------------------home get route ----------------------------


app.get("/", function (req, res) {
    Item.find({}, function (err, found) {

        if (found.length === 0) {

            Item.insertMany(defultItem, function (err) {
                if (err) { console.log(err) }
                else { console.log("Your Items Successfully  Added in DB") }

            })
            res.redirect('/')
        }

        else {
            // console.log(found)
            res.render("index", { Listtittle: day, newadd: found })
        }

        // console.log(found)
        // 

    })
    // var day = date.getDate()

})

// day not working diffrernt method to make new day
// -------------------------------------------------------------------------------------------------------------------------
const today = new Date()
const option = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'

}
const day = today.toLocaleDateString("US-en", option)
// ---------------------------------------------------------------------------------------------------------------------------


app.post('/', function (req, res) {
    const listittle = req.body.list;


    var newTask = req.body.newitem;


    const item = new Item({
        Name: newTask
    })

    if (listittle === day) {
        item.save()
        res.redirect('/')

    }
    else {
        list.findOne({ name: listittle }, function (err, found) {
            if (err) {
                console.log(err)

            }
            else {
                found.listitem.push(item)
                
                found.save()
                res.redirect('/' + listittle)
            }
        })
    }


})


app.get('/:costomListName', (req, res) => {


    const costomlist = _.capitalize(req.params.costomListName);

    list.findOne({ name: costomlist }, function (err, found) {
        if (!err) {
            if (!found) {
                //create a new list
                const List = new list({
                    name: costomlist,
                    listitem: defultItem
                })


                List.save()
                res.redirect('/' + costomlist)
            }
            else {
                res.render("index", { Listtittle: found.name, newadd: found.listitem })
            }
        }

    })



})


// -------------------------delete Route------------------------------------------------------------------------
app.post('/delete', function (req, res) {
    const deleteitem = req.body.checked;
    const listName = req.body.listname


    if (listName === day) {
        Item.findByIdAndRemove(deleteitem, (err, docs) => {
            if (!err) {
                res.redirect("/")

            }
        });
    }

    else {
        list.findOneAndUpdate({ name: listName }, { $pull: { listitem: { _id: deleteitem } } }, function (err, found) {
            if (!err) {
                res.redirect('/' + listName)
            }
        })

    }

});



app.listen(3000, function () {
    console.log("Your Server is runing on port 3000")
})