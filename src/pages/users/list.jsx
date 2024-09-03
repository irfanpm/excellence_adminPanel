import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { fireDB } from "../../Firebase/fireBaseConfig.jsx";
import {
  Table,
  Button,
  Modal,
  Label,
  TextInput,
} from 'flowbite-react';
import { HiOutlinePencilAlt, HiTrash, HiOutlineExclamationCircle, HiChevronLeft, HiChevronRight, HiPlus } from 'react-icons/hi';
import NavbarSidebarLayout from '../../layouts/navbar-sidebar';

const UserReviewPage = () => {
  return (
    <div className="">
      <ReviewTable />
    </div>
  );
};

const ReviewTable = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentReview, setCurrentReview] = useState(null);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(fireDB, 'reviews'));
        const reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(reviewsData);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch reviews');
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleEditReview = (review) => {
    setCurrentReview(review);
    setEditModalOpen(true);
  };

  const handleDeleteReview = (id) => {
    setReviewToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleAddReview = async (newReview) => {
    try {
      const docRef = await addDoc(collection(fireDB, 'reviews'), newReview);
      setReviews([...reviews, { id: docRef.id, ...newReview }]);
    } catch (error) {
      console.error('Error adding review:', error);
    }

    setAddModalOpen(false);
  };

  const handleSaveReview = async (updatedReview) => {
    try {
      const reviewRef = doc(fireDB, 'reviews', updatedReview.id);
      await updateDoc(reviewRef, updatedReview);
      setReviews(reviews.map(review => (review.id === updatedReview.id ? updatedReview : review)));
    } catch (error) {
      console.error('Error editing review:', error);
    }

    setEditModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (reviewToDelete !== null) {
      try {
        const reviewRef = doc(fireDB, 'reviews', reviewToDelete);
        await deleteDoc(reviewRef);
        setReviews(reviews.filter(review => review.id !== reviewToDelete));
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }

    setDeleteModalOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <NavbarSidebarLayout>
      <div className="mb-4">
        <Button color="success" onClick={() => setAddModalOpen(true)}>
          <div className="flex items-center gap-x-2">
            <HiPlus className="text-lg" />
            Add Review
          </div>
        </Button>
      </div>
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <Table.Head className="bg-gray-50 dark:bg-gray-700">
          <Table.HeadCell>User</Table.HeadCell>
          <Table.HeadCell>Review</Table.HeadCell>
          <Table.HeadCell>Rating</Table.HeadCell>
          <Table.HeadCell>Position</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {reviews.map(review => (
            <Table.Row key={review.id} className="bg-white dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 dark:text-white">{review.name}</Table.Cell>
              <Table.Cell className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 dark:text-white">{review.review}</Table.Cell>
              <Table.Cell className="whitespace-nowrap px-4 py-2 text-sm text-yellow-500">{review.rating}/5</Table.Cell>
              <Table.Cell className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 dark:text-white">{review.position}</Table.Cell>
              <Table.Cell className="whitespace-nowrap px-4 py-2 text-sm font-medium">
                <div className="flex items-center gap-x-3">
                  <Button color="primary" onClick={() => handleEditReview(review)}>
                    <div className="flex items-center gap-x-2">
                      <HiOutlinePencilAlt className="text-lg" />
                      Edit
                    </div>
                  </Button>
                  <Button color="failure" onClick={() => handleDeleteReview(review.id)}>
                    <div className="flex items-center gap-x-2">
                      <HiTrash className="text-lg" />
                      Delete
                    </div>
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {isEditModalOpen && currentReview && (
        <EditReviewModal
          review={currentReview}
          onSave={handleSaveReview}
          onClose={() => setEditModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteReviewModal
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}

      {isAddModalOpen && (
        <AddReviewModal
          onAdd={handleAddReview}
          onClose={() => setAddModalOpen(false)}
        />
      )}

      <Pagination />
    </NavbarSidebarLayout>
  );
};

const EditReviewModal = ({ review, onSave, onClose }) => {
  const [updatedReview, setUpdatedReview] = useState(review);

  return (
    <Modal
      show={true}
      onClose={onClose}
      size="md"
    >
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>Edit Review</strong>
      </Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <div className="mt-1">
              <TextInput
                id="name"
                name="name"
                value={updatedReview.name}
                onChange={(e) => setUpdatedReview({ ...updatedReview, name: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="review">Review</Label>
            <div className="mt-1">
              <TextInput
                id="review"
                name="review"
                value={updatedReview.review}
                onChange={(e) => setUpdatedReview({ ...updatedReview, review: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="rating">Rating</Label>
            <div className="mt-1">
              <TextInput
                id="rating"
                name="rating"
                type="number"
                min="1"
                max="5"
                value={updatedReview.rating}
                onChange={(e) => setUpdatedReview({ ...updatedReview, rating: Number(e.target.value) })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="position">Position</Label>
            <div className="mt-1">
              <TextInput
                id="position"
                name="position"
                value={updatedReview.position}
                onChange={(e) => setUpdatedReview({ ...updatedReview, position: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => onSave(updatedReview)}>Save</Button>
        <Button color="gray" onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

const DeleteReviewModal = ({ onConfirm, onClose }) => {
  return (
    <Modal
      show={true}
      onClose={onClose}
      size="sm"
    >
      <Modal.Header>
        <strong>Confirm Delete</strong>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this review?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button color="failure" onClick={onConfirm}>Confirm</Button>
        <Button color="gray" onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

const AddReviewModal = ({ onAdd, onClose }) => {
  const [newReview, setNewReview] = useState({
    name: '',
    review: '',
    rating: 1,
    position: ''
  });

  return (
    <Modal
      show={true}
      onClose={onClose}
      size="md"
    >
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>Add New Review</strong>
      </Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <div className="mt-1">
              <TextInput
                id="name"
                name="name"
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="review">Review</Label>
            <div className="mt-1">
              <TextInput
                id="review"
                name="review"
                value={newReview.review}
                onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="rating">Rating</Label>
            <div className="mt-1">
              <TextInput
                id="rating"
                name="rating"
                type="number"
                min="1"
                max="5"
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="position">Position</Label>
            <div className="mt-1">
              <TextInput
                id="position"
                name="position"
                value={newReview.position}
                onChange={(e) => setNewReview({ ...newReview, position: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => onAdd(newReview)}>Add</Button>
        <Button color="gray" onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

const Pagination = () => {
  return (
    <div className="flex justify-between items-center mt-4">
      <Button color="gray" disabled>
        <HiChevronLeft />
      </Button>
      <Button color="gray" disabled>
        1
      </Button>
      <Button color="gray" disabled>
        <HiChevronRight />
      </Button>
    </div>
  );
};

export default UserReviewPage;
