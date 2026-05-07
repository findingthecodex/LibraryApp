import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuoteService, Quote } from '../../services/quote.service';

@Component({
  selector: 'app-quotes',
  imports: [CommonModule, FormsModule],
  templateUrl: './quotes.html',
  styleUrl: './quotes.css',
})
export class Quotes implements OnInit {
  quotes: Quote[] = [];
  newQuote: Quote = { text: '', author: '', userId: 0 };
  showForm = false;
  editingId: number | null = null;
  loading = false;
  currentPage = 1;
  readonly pageSize = 5;

  get sortedQuotes(): Quote[] {
    return [...this.quotes].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  }

  get pagedQuotes(): Quote[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.sortedQuotes.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.quotes.length / this.pageSize));
  }

  prevPage() { if (this.currentPage > 1) this.currentPage--; }
  nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }

  constructor(private quoteService: QuoteService) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    this.newQuote.userId = userId ? parseInt(userId, 10) : 0;
    this.loadQuotes();
  }

  loadQuotes() {
    this.quoteService.getQuotes().subscribe({
      next: (data) => {
        this.quotes = data;
        this.currentPage = 1;
      },
      error: (err) => console.error(err)
    });
  }

  toggleForm() {
    if (!this.showForm) {
      this.showForm = true;
    } else {
      this.showForm = false;
      this.editingId = null;
      const userId = localStorage.getItem('userId');
      this.newQuote = {
        text: '',
        author: '',
        userId: userId ? parseInt(userId, 10) : 0
      };
    }
  }

  saveQuote() {
    this.newQuote.userId = parseInt(localStorage.getItem('userId') || '0', 10);

    if (!this.newQuote.text || !this.newQuote.author) {
      alert('Please fill in all fields');
      return;
    }

    this.loading = true;
    if (this.editingId) {
      this.quoteService.updateQuote(this.editingId, this.newQuote).subscribe({
        next: () => {
          this.loading = false;
          this.loadQuotes();
          this.toggleForm();
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.quoteService.createQuote(this.newQuote).subscribe({
        next: () => {
          this.loading = false;
          this.loadQuotes();
          this.toggleForm();
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  editQuote(quote: Quote) {
    this.newQuote = { ...quote };
    this.editingId = quote.id || null;
    this.showForm = true;
  }

  deleteQuote(id: number | undefined) {
    if (!id) return;
    if (confirm('Are you sure?')) {
      this.quoteService.deleteQuote(id).subscribe({
        next: () => this.loadQuotes(),
        error: (err) => console.error(err)
      });
    }
  }
}
