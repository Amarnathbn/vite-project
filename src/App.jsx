import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackward,
  faBackwardFast,
  faBackwardStep,
  faEdit,
  faForwardFast,
  faForwardStep,
  faTrash,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editedValues, setEditedValues] = useState({});
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      )
      .then((response) => {
        const initialData = response.data.map((item) => ({
          ...item,
          isEditing: false,
        }));
        setData(initialData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowClick = (id) => {
    const isSelected = selectedRows.includes(id);
    if (isSelected) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleDeleteSelected = () => {
    setData(data.filter((item) => !selectedRows.includes(item.id)));
    setSelectedRows([]);
  };

  const handleEditClick = (id) => {
    const updatedData = data.map((item) => {
      if (item.id === id) {
        return { ...item, isEditing: !item.isEditing };
      }
      return item;
    });
    setData(updatedData);
  };

  const handleSaveClick = (id) => {
    const updatedData = data.map((item) => {
      if (item.id === id) {
        return { ...item, ...editedValues[id], isEditing: false };
      }
      return item;
    });
    setData(updatedData);
    const updatedEditedValues = { ...editedValues };
    delete updatedEditedValues[id];
    setEditedValues(updatedEditedValues);
  };

  const handleInputChange = (id, field, value) => {
    setEditedValues((prevState) => ({
      ...prevState,
      [id]: { ...prevState[id], [field]: value },
    }));
  };

  const visibleData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearch}
      />
      <table className="data-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visibleData.map((item) => (
            <tr key={item.id} onClick={() => handleRowClick(item.id)}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(item.id)}
                  onChange={() => {}}
                />
              </td>
              <td>{item.id}</td>
              <td>
                {item.isEditing ? (
                  <input
                    type="text"
                    value={editedValues[item.id]?.name}
                    onChange={(e) =>
                      handleInputChange(item.id, "name", e.target.value)
                    }
                  />
                ) : (
                  item.name
                )}
              </td>
              <td>
                {item.isEditing ? (
                  <input
                    type="text"
                    value={editedValues[item.id]?.email}
                    onChange={(e) =>
                      handleInputChange(item.id, "email", e.target.value)
                    }
                  />
                ) : (
                  item.email
                )}
              </td>
              <td>
                {item.isEditing ? (
                  <input
                    type="text"
                    value={editedValues[item.id]?.role}
                    onChange={(e) =>
                      handleInputChange(item.id, "role", e.target.value)
                    }
                  />
                ) : (
                  item.role
                )}
              </td>
              <td>
                {item.isEditing ? (
                  <button onClick={() => handleSaveClick(item.id)}>Save</button>
                ) : (
                  <button onClick={() => handleEditClick(item.id)}>
                    {" "}
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </button>
                )}
                <button onClick={handleDeleteSelected}>
                  {" "}
                  <FontAwesomeIcon icon={faTrashAlt} />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          <FontAwesomeIcon icon={faBackwardFast} />
        </button>
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <FontAwesomeIcon icon={faBackwardStep} />
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <FontAwesomeIcon icon={faForwardStep} />
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          <FontAwesomeIcon icon={faForwardFast} />
        </button>
      </div>
      <div className="delete-selected-btn">
        <button onClick={handleDeleteSelected}>
          {" "}
          <FontAwesomeIcon icon={faTrashAlt} />
          Delete Selected
        </button>
      </div>
    </div>
  );
};

export default App;
