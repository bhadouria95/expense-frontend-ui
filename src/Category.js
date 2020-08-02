import React, { Component } from 'react';
import AppNav from './AppNav';
import { Container, Button, Form, FormGroup, Table, Input, Label } from 'reactstrap';
import { Link } from 'react-router-dom';

class Category extends Component {

    emptyItem = {
        id: '4',
        name: ''
    }

    constructor(props) {
        super(props);

        this.state = {
            isLoading:  true,
            categories: [],
            item: this.emptyItem
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(event) {
        const item = this.state.item;
        await fetch('/api/category', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        } );

        event.preventDefault();
        this.props.history.push('/categories');
    }

    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    async removeCategory(id) {
        await fetch(`/api/category/${id}`, {
            method: 'DELETE',
            header: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        } ).then( () => {
            let updatedCategories = [...this.state.categories].filter( category => category.id !== id );
            this.setState({categories: updatedCategories});
        } );
    }

    // sync.    you send the request and wait for response
    // async.   you send the request and don't wait
    async componentDidMount() {
        const response = await fetch('/api/categories');
        const body = await response.json();
        this.setState({
            categories: body,
            isLoading: false
        });
    }

    render() {
        const {categories, isLoading} = this.state;
        const title = <h3>Categories</h3>
        
        if(isLoading) {
            return(<div>Loading...</div>)
        }

        console.log(categories);
        let rows = categories.map(category => 
            <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td><Button size="sm" color="danger" onClick={() => this.removeCategory(category.id)}>Delete</Button></td>
            </tr> );

        return ( 
            <div>
                <AppNav />
                <Container>
                    {title}

                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="description">Category Name</Label>
                            <Input type="text" name="name" id="name"
                                onChange={this.handleChange} autoComplete="name" />
                        </FormGroup>

                        <FormGroup>
                            <Button color="primary" type="submit">Save</Button>{' '}
                            <Button color="secondary" tag={Link} to="/">Cancel</Button>
                        </FormGroup>     
                    </Form>
                </Container>

                {' '}
                <Container>
                    <h3>Expense List</h3>
                    <Table className="mt-4">
                        <thead>
                            <tr>
                                <th width="20%">ID</th>
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
 
export default Category;