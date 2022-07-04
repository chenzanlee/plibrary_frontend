class Drawer {
    constructor() {
        this.bookNum = 0;
        this.books = null;
        this.cover = "common/drawer/drawer_default_cover.jpg";
        this.crtTime = null;
        this.id = null;
        this.name = "默认分类";
        this.openId = null;
        this.updTime = null;
        this.visibility = false;
        this.successLoadedBooks = false;
        this.addBook = function (book) {
            if (this.successLoadedBooks) {
                var books = (this.books || []).slice()
                books.unshift(book)
                this.books = books
            }
            this.refresh()
        };
        this.removeBook = function (book) {
            if (this.successLoadedBooks) {
                var copy = this.books.slice()
                var pos = copy.findIndex(item => item.id === book.id)
                copy.splice(pos, 1)
                this.books = copy
            }
            this.refresh()
        }
        this.replaceBook = function (book) {
            if (this.successLoadedBooks) {
                var temp = this.books.slice()
                var pos = temp.findIndex(item => item.id === book.id)
                if (pos !== -1) {
                    temp.splice(pos, 1, book)
                    this.books = temp
                }
                this.refresh()
            }
        }
        this.refresh = function () {
            this.bookNum = this.books ? this.books.reduce((acc, b) => {
                return acc + b.count
            }) : 0
        };
    }
}

export default Drawer;
