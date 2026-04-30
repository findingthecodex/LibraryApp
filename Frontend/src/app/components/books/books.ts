import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService, Book } from '../../services/book.service';
@Component({
  selector: 'app-books',
  imports: [CommonModule, FormsModule],
  templateUrl: './books.html',
  styleUrl: './books.css',
})
export class Books implements OnInit {
  books: Book[] = [];
  newBook: Book = { title: '', author: '', publishDate: '', userId: 0 };
  showForm = false;
  editingId: number | null = null;
  loading = false;
  constructor(private bookService: BookService) {}
  ngOnInit() {
    this.loadBooks();
  }
  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
      },
      error: (err) => console.error(err)
    });
  }
  toggleForm() {
    this.showForm = !this.showForm;
    this.editingId = null;
    this.newBook = { title: '', author: '', publishDate: '', userId: 0 };
  }
  saveBook() {
    if (!this.newBook.title || !this.newBook.author) {
      alert('Please fill in all fields');
      return;
    }
    this.loading = true;
    if (this.editingId) {
      this.bookService.updateBook(this.editingId, this.newBook).subscribe({
        next: () => {
          this.loading = false;
          this.loadBooks();
          this.toggleForm();
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.bookService.createBook(this.newBook).subscribe({
        next: () => {
          this.loading = false;
          this.loadBooks();
          this.toggleForm();
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
  editBook(book: Book) {
    this.newBook = { ...book };
    this.editingId = book.id || null;
    this.showForm = true;
  }
  deleteBook(id: number | undefined) {
    if (!id) return;
    if (confirm('Are you sure?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => this.loadBooks(),
        error: (err) => console.error(err)
      });
    }
  }
}
