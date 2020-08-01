import React, { Component } from 'react';
import AppNav from './AppNav';
import DatePicker from 'react-datepicker';

import './App.css';
import 'react-datepicker/dist/react-datepicker.css';
import { Container, Form, FormGroup, Button, Input, Label, Table } from 'reactstrap';
import { Link } from 'react-router-dom'
import Moment from 'react-moment';

class Expenses extends Component {

    emptyItem = {
        expensedate: new Date(),
        description: '',
        id: '103',
        location: '',
        category: {id: 1, name: 'Travel'}
    }

    constructor(props) {
        super(props);
        
        this.state = {
            date: new Date(),
            isLoading: true,
            categories: [],
            expenses: [],
            item: this.emptyItem
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    async handleSubmit(event) {
        
        const item = this.state.item;
        await fetch('/api/expenses', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        } );
        event.preventDefault();
        this.props.history.push('/expenses');
    }

    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    handleDateChange(date) {
        let item = {...this.state.item};
        item.expensedate = date;
        this.setState({item});
    }

    async removeExpense(id) {
        await fetch(`/api/expenses/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        } ).then( () => {
            let updatedExpenses = [...this.state.expenses].filter(expense => expense.id !== id);
            this.setState({expenses: updatedExpenses});
        } );
    }

    async componentDidMount() {
        const response = await fetch('/api/categories');
        const body = await response.json();
        this.setState( {
            categories: body,
            isLoading: false
        } );

        const responseExp = await fetch('/api/expenses');
        const bodyExp = await responseExp.json();
        this.setState( {
            expenses: bodyExp,
            isLoading: false
        } );
    }

    render() { 
        const title=<h3>Add Expense</h3>
        const { categories } = this.state;
        const { expenses, isLoading } = this.state;

        if( isLoading ) {
            return ( <div>Loading...</div> );
        }
        let optionList = categories.map( category => 
                <option key={category.id} id={category.id}>
                    {category.name}
                </option>
            );
        let rows = expenses.map(expense => 
                <tr key={expense.id}>
                    <td>{expense.description}</td>
                    <td>{expense.location}</td>
                    <td><Moment date={expense.expensedate} format="YYYY/MM/DD"/></td>
                    <td>{expense.category.name}</td>
                    <td><Button size="sm" color="danger" onClick={()=>this.removeExpense(expense.id)}>Delete</Button></td>
                </tr>
            );

        return ( 
            <div>
                <AppNav />
                <Container>
                    {title}

                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="description">Title</Label>
                            <Input type="text" name="description" id="description"
                                onChange={this.handleChange} autoComplete="name" />
                        </FormGroup>

                        <FormGroup>
                            <Label for="category">Category</Label>
                            <select>
                                {optionList}
                            </select>
                        </FormGroup>

                        <FormGroup>
                            <Label for="city">Date</Label>
                            <DatePicker selected={this.state.item.expensedate} onChange={this.handleDateChange} />
                        </FormGroup>

                        <div className="row">
                            <FormGroup className="col-md-4 mb-3">
                                <Label for="location">Location</Label>
                                <Input type="text" name="location" id="location" onChange={this.handleChange} />
                            </FormGroup>
                        </div>

                        <FormGroup>
                            <Button color="primary" type="submit">Save</Button>{' '}
                            <Button color="secondary" tag={Link} to="/">Cancel</Button>
                        </FormGroup>     
                    </Form>
                </Container>

                {''}
                <Container>
                    <h3>Expense List</h3>
                    <Table className="mt-4">
                        <thead>
                            <tr>
                                <th width="20%">Description</th>
                                <th width="10%">Location</th>
                                <th>Date</th>
                                <th>Category</th>
                                <th width="10%">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>

                    </Table>
                </Container>
            </div>
        );
    }
}
 
export default Expenses;