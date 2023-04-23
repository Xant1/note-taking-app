import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import API_BASE_URL from '../Api_Url/API_URL';

function App() {
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');
  const [notes, setNotes] = useState('');
  const [userId, setUserId] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const getItemsList = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/notes`);
        setListItems(res.data);
        const user = localStorage.getItem('user');
        const id = JSON.parse(user);
        setUserId(id.id);
      } catch (err) {
        console.log(err);
      }
    };
    getItemsList();
  }, [added]);

  const filteredData = useMemo(() => {
    if (userId) {
      return listItems.filter((item) => item.user_id === userId);
    }
    return listItems;
  }, [userId, listItems]);

  const addItem = async (e) => {
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}/notes`, {
        notes: notes,
        user_id: userId,
      })
      .then((data) => setListItems([...listItems, data]))
      .catch((err) => console.log(err));
    setNotes('');
    setAdded(false);
  };

  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/notes/${id}`);
      const newListItems = listItems.filter((item) => item.id !== id);
      setListItems(newListItems);
    } catch (err) {
      console.log(err);
    }
  };

  const updateItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_BASE_URL}/notes/${isUpdating}`, {
        notes: updateItemText,
      });

      const updatedItemIndex = listItems.findIndex(
        (item) => item.id === isUpdating
      );
      const updatedItem = (listItems[updatedItemIndex].notes = updateItemText);
      setUpdateItemText('');
      setIsUpdating('');
    } catch (err) {
      console.log(err);
    }
  };

  const renderUpdateForm = () => (
    <form
      className=''
      onSubmit={(e) => {
        updateItem(e);
      }}>
      <input
        className='form-control'
        type='text'
        placeholder='New Item'
        onChange={(e) => {
          setUpdateItemText(e.target.value);
        }}
        value={updateItemText}
      />
      <button className='btn btn-info' type='submit'>
        Update
      </button>
    </form>
  );

  return (
    <div className='container'>
      <form method='post' className='d-flex mt-5' onSubmit={(e) => addItem(e)}>
        <input
          className='form-control'
          type='text'
          placeholder='Add Note'
          onChange={(e) => {
            setNotes(e.target.value);
          }}
          value={notes}
        />
        <button
          onClick={() => setAdded(true)}
          className='btn btn-success'
          type='submit'>
          Add
        </button>
      </form>
      <div className='row mt-5'>
        {filteredData.map((item, i) => (
          <div key={i} className='col-md-3 '>
            {isUpdating === item.id ? (
              renderUpdateForm()
            ) : (
              <>
                <div className='card mb-3 box-shadow'>
                  <div className='cart-body bg-warning'>
                    <p className='card-text p-3 '>{item.notes}</p>

                    <div className='d-flex justify-content-between align-items-center'>
                      <button
                        className='btn btn-info'
                        onClick={() => {
                          setIsUpdating(item.id);
                        }}>
                        Update
                      </button>

                      <button
                        className='btn btn-danger'
                        onClick={() => {
                          deleteItem(item.id);
                        }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
