
function fakeBooks(opts = {n: 5}){

    const books = [];
    let howMany = opts.n;

    while(howMany-- >0){
        let id = uuid();
        let count = (opts.n -howMany)
        const book ={
            uuid: id,
            type: "Book",
            title: `The Book Title ${count}`,
            subtitle:`Lorem ipsum dolor ${count}`,
            isbn: count
        };
        books.push(book)
    }
    return books
}


const db = require('gun')();
require("gun/lib/then");
const books = fakeBooks()
for(let b of books){
    db.get(b.uuid).put(b)
}

const bookNodes = books.map(b => db.get(b.uuid));

function reviewBook(opt){
    const {db,reader ,book,rating,content} = opt;
    const linkId = uuid()

    const review = db.get(linkId).put({
        uuid: linkId,
        type: "Link",
        name: "review_book",
        rating: rating,
        content: content


    })

    review.get("book").put(book)
    review.get("reader").put(reader);

    db.get(`reviews/${rating}`).set(review)

    book.get("reviews").set(review);
    reader.get("book_reviews").set(review);
    return review;

}

reviewBook({
    db,
    reader: readerNodes[0],
    book: bookNodes[0],
    rating: 5,
    content: "Great book!",
  });
  
  reviewBook({
    db,
    reader: readerNodes[0],
    book: bookNodes[1],
    rating: 1,
    content: "It was ok.",
  });

  readerNodes[0].get("book_reviews").map().once(console.log);


function uuid(){
    return Math.random();
}

bookNodes[0].get("reviews")
.map()
.once(review => {
  if(review.rating === 5) {
    db.get(review.book).once(b => {
      console.log(review);
    });
  }
});

// For understanding how promises work on GunDB
// const removeMetaData = (o) => { // A
//     const copy = {...o};
//     delete copy._;
//     return copy;
//   };
  
//   const bookReviews = readerNodes[0].get("book_reviews").then() // B
//   .then(o => removeMetaData(o)) // C
//   .then(refs => Promise.all(Object.keys(refs).map(k => db.get(k).then()))) // D
//   .then(r => console.log(r)); // E

function authorBook(opt) {
    const {db, author, book, date} = opt;
    const linkId = uuid();
  
    const authorBookNode = db.get(linkId).put({
      uuid: linkId,
      type: "Link",
      name: "author_book",
      date: date,
    });
    authorBookNode.get("book").put(book);
    authorBookNode.get("author").put(author);
  
    book.get("authors").set(authorBookNode);
    author.get("books").set(authorBookNode);
  
    return authorBookNode;
  }
  function favoriteBooks(opt) {
    const {db, reader, books, listName} = opt;
    const listId = uuid();
  
    const list = db.get(listId).put({
      uuid: listId,
      type: "Link",
      name: "favorite_list",
      list_name: listName,
    });
  
    const faveBooks = db.get(uuid());
    for (book of books) {
      faveBooks.set(book);
    }
  
    list.get("books").put(faveBooks);
    list.get("belongs_to").put(reader);
  
    reader.get("favorite_books").set(list);
  
    return list;
  }




