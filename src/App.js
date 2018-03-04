import React, { Component } from 'react';
import WooCommerceAPI from 'woocommerce-api';

var WooCommerce = new WooCommerceAPI({
  url: 'https://', // Your store URL
  consumerKey: 'ck_', // Your consumer key
  consumerSecret: 'cs_', // Your consumer secret
  wpAPI: true, // Enable the WP REST API integration
  version: 'wc/v2' // WooCommerce WP REST API version
});

class App extends Component {
  state = {
    product_name: '',
    product_id: '',
    product_sku: '',
    product_status: '',
    product_author: '',
    product_regular_price: '',
    product_stock_quantity: '',
    author_keywords: '',
    product_keywords: '',
    keywords_or_author_search_result_array: [],
    search_status: 'please enter to search'
  }

  get_product_by_id = () => {
    this.setState({
      search_status: 'searching now...',
      author_keywords: '',
      product_author: '',
      product_keywords: '',
      product_sku: ''
    })
    WooCommerce.get(`products/${this.state.product_id}`, (err, data, res) => {
      if (data.statusCode === 200) {
        const book = (JSON.parse(res));
        this.setState({
          search_status: 'success',
          product_name: book.name,
          product_author: book.attributes[0].options[0],
          product_id: book.id,
          product_sku: book.sku,
          product_status: book.status,
          product_regular_price: book.regular_price,
          product_stock_quantity: book.stock_quantity
        })
        console.log(book);
      } else {
        this.setState({
          search_status: data.statusCode
        })
      }
    });
  }

  get_product_by_sku = () => {
    this.setState({
      search_status: 'searching now...',
      product_id: '',
      author_keywords: '',
      product_author: '',
      product_keywords: ''

    })
    WooCommerce.get(`products?sku=${this.state.product_sku}`, (err, data, res) => {
      if (data.statusCode === 200 && JSON.parse(res).length !== 0) {
        const book = (JSON.parse(res))[0];
        this.setState({
          search_status: 'success',
          product_name: book.name,
          product_author: book.attributes[0].options[0],
          product_id: book.id,
          product_sku: book.sku,
          product_status: book.status,
          product_regular_price: book.regular_price,
          product_stock_quantity: book.stock_quantity
        })
        console.log(book);
      } else if (data.statusCode === 200 && JSON.parse(res).length === 0) {
        this.setState({
          search_status: 'item not in databse'
        })
      } else if (data.statusCode !== 200) {
        this.setState({
          search_status: data.statusCode
        })
      }

    });
  }

  get_products_by_author = () => {
    this.setState({
      search_status: 'searching now...',
      product_id: '',
      product_keywords: '',
      product_sku: ''
    })

    WooCommerce.get(`products?search=${this.state.author_keywords}&per_page=100`, (err, data, res) => {
      if (data.statusCode === 200 && JSON.parse(res).length !== 0) {
        const book_array = (JSON.parse(res));
        console.log('book_array', book_array);
        const filtered_array = book_array.filter(el => el.attributes[0].options[0].includes(this.state.author_keywords));
        console.log('filtered_array', filtered_array);
        this.setState({
          search_status: 'Success,this author has following book(s)',
          keywords_or_author_search_result_array: filtered_array
        })
      } else if (data.statusCode === 200 && JSON.parse(res).length === 0) {
        this.setState({
          search_status: 'item not in databse'
        })
      } else if (data.statusCode !== 200) {
        this.setState({
          search_status: data.statusCode
        })
      }

    });
  }


  get_products_by_keywords = () => {
    this.setState({
      search_status: 'searching now...',
      author_keywords: '',
      product_id: '',
      product_sku: ''
    })

    WooCommerce.get(`products?search=${this.state.product_keywords}&per_page=100`, (err, data, res) => {
      if (data.statusCode === 200 && JSON.parse(res).length !== 0) {
        const book_array = (JSON.parse(res));
        const filtered_array = book_array.filter(el => el.name.includes(this.state.product_keywords))
        this.setState({
          search_status: 'Success,following book(s) contain searched keywords in their titles',
          keywords_or_author_search_result_array: filtered_array
        })
        console.log(this.state.keywords_or_author_search_result_array);

      } else if (data.statusCode === 200 && JSON.parse(res).length === 0) {
        this.setState({
          search_status: 'item not in databse'
        })
      } else if (data.statusCode !== 200) {
        this.setState({
          search_status: data.statusCode
        })
      }

    });
  }

  onInputIdChange = (product_id) => {
    this.setState({ product_id: product_id });
  }

  onInputSkuChange = (product_sku) => {
    this.setState({ product_sku: product_sku });
  }

  onInputAuthorChange = (author_keywords) => {
    this.setState({ author_keywords: author_keywords });
  }

  onInputKeywordsChange = (product_keywords) => {
    this.setState({ product_keywords: product_keywords });
  }

  render() {
    return (
      <div className="App" style={{ marginLeft: 'auto', marginRight: 'auto', width: 80 + '%' }}>
        <h2>ID: <input
          value={this.state.product_id}
          onChange={event => this.onInputIdChange(event.target.value)} />
          <button onClick={this.get_product_by_id}> Search</button>
        </h2>


        <h2>SKU: <input
          value={this.state.product_sku}
          onChange={event => this.onInputSkuChange(event.target.value)} />
          <button onClick={this.get_product_by_sku}> Search</button>
        </h2>

        <h2>Author: <input
          value={this.state.author_keywords}
          onChange={event => this.onInputAuthorChange(event.target.value)} />
          <button onClick={this.get_products_by_author}> Search</button>
        </h2>

        <h2>Keywords: <input
          value={this.state.product_keywords}
          onChange={event => this.onInputKeywordsChange(event.target.value)} />
          <button onClick={this.get_products_by_keywords}> Search</button>
        </h2>

        <p style={{ color: '#6c757d' }}>Note: <br/>
        this app is meant for <b>localhost use ONLY!</b> Please <b>DO NOT</b> deploy as your api keys will be exposed.<br/>
        For security reason, please genereate Read Only api keys.<br/>
        Please keep this file in a private computer as anyone who can access this file can copy your api keys, thus fetch private data such as customer details / orders from your website.</p>

        <hr />

        <h3 style={{ color: '#545b62' }}>{this.state.search_status}</h3>
        {this.state.search_status === 'success' ?
          <div>
            <p><span style={{ color: '#6c757d' }}> Name:</span> {this.state.product_name}</p>
            <p><span style={{ color: '#6c757d' }}> Author:</span> {this.state.product_author}</p>
            <p><span style={{ color: '#6c757d' }}> ID:</span> {this.state.product_id}</p>
            <p><span style={{ color: '#6c757d' }}> Sku:</span> {this.state.product_sku}</p>
            <p><span style={{ color: '#6c757d' }}> Status:</span> {this.state.product_status}</p>
            <p><span style={{ color: '#6c757d' }}> Price:</span> {this.state.product_regular_price}</p>
            <p><span style={{ color: '#6c757d' }}> Quantity:</span> {this.state.product_stock_quantity}</p>
          </div> : null
        }

        {this.state.search_status === 'Success,following book(s) contain searched keywords in their titles' ?
          <div>
            <ol>{this.state.keywords_or_author_search_result_array.map(el =>
              <p key={el.id}>
                <li>{el.name}<br />
                  <span style={{ color: '#6c757d' }}>Author:</span> {el.attributes[0].options[0]}<br />
                  <span style={{ color: '#6c757d' }}>Status:</span> {el.status}<br />
                  <span style={{ color: '#6c757d' }}>Price:</span> $ {el.regular_price}<br />
                  <span style={{ color: '#6c757d' }}>Qty:</span> {el.stock_quantity}
                </li>
              </p>
            )}
            </ol>
          </div>
          : null
        }

        {this.state.search_status === 'Success,this author has following book(s)' ?
          <div>
            <ol>{this.state.keywords_or_author_search_result_array.map(el =>
              <p key={el.id}>
                <li>{el.name}<br />
                  <span style={{ color: '#6c757d' }}>Author:</span> {el.attributes[0].options[0]}<br />
                  <span style={{ color: '#6c757d' }}>Status:</span> {el.status}<br />
                  <span style={{ color: '#6c757d' }}>Price:</span> $ {el.regular_price}<br />
                  <span style={{ color: '#6c757d' }}>Qty:</span> {el.stock_quantity}
                </li>
              </p>
            )}
            </ol>
          </div>
          : null
        }
      </div>
    );
  }
}

export default App;
