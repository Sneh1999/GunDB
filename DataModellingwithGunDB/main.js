
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
