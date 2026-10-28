
import React, { useState } from "react";

const Documents = () => {
  const today = new Date().toISOString().slice(0, 10);

  const emptyForm = {
    title: "",
    category: "Quotation",
    customer: "",
    project: "",
    fileName: "",
    uploadedBy: "",
    uploadDate: today,
    status: "Pending",
    notes: "",
  };

  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fileError, setFileError] = useState("");

  const allowedExtensions = [
    "pdf", "doc", "docx", "xls", "xlsx",
    "jpg", "jpeg", "png",
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData({ ...emptyForm });
    setSelectedFile(null);
    setFileError("");
    setShowForm(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const extension = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setFileError("Unsupported file type. Please select a PDF, Word, Excel, JPG, or PNG file.");
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size must be 10 MB or less.");
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    setFileError("");
    setSelectedFile(file);

    setFormData((previous) => ({
      ...previous,
      fileName: file.name,
    }));
  };

  const openEditForm = (document) => {
    setEditingId(document.id);

    setFormData({
      title: document.title,
      category: document.category,
      customer: document.customer,
      project: document.project,
      fileName: document.fileName,
      uploadedBy: document.uploadedBy,
      uploadDate: document.uploadDate,
      status: document.status,
      notes: document.notes,
    });

    setSelectedFile(null);
    setFileError("");
    setShowForm(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (fileError) return;

    if (editingId === null && !selectedFile) {
      setFileError("Please select a document to upload.");
      return;
    }

    const fileUrl = selectedFile
      ? URL.createObjectURL(selectedFile)
      : documents.find((document) => document.id === editingId)?.fileUrl || "";

    const documentData = {
      ...formData,
      fileName: selectedFile ? selectedFile.name : formData.fileName,
      fileUrl,
    };

    if (editingId !== null) {
      setDocuments((previous) =>
        previous.map((document) =>
          document.id === editingId
            ? { ...document, ...documentData }
            : document
        )
      );
    } else {
      setDocuments((previous) => [
        ...previous,
        {
          id: Date.now(),
          ...documentData,
        },
      ]);
    }

    setFormData({ ...emptyForm });
    setSelectedFile(null);
    setEditingId(null);
    setShowForm(false);
    setFileError("");
  };

  const handleDelete = (id, title) => {
    if (!window.confirm(`Delete the document "${title}"?`)) return;

    const documentToDelete = documents.find(
      (document) => document.id === id
    );

    if (documentToDelete?.fileUrl) {
      URL.revokeObjectURL(documentToDelete.fileUrl);
    }

    setDocuments((previous) =>
      previous.filter((document) => document.id !== id)
    );
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ ...emptyForm });
    setSelectedFile(null);
    setFileError("");
  };

  const filteredDocuments = documents.filter((document) => {
    const searchText = [
      document.title,
      document.category,
      document.customer,
      document.project,
      document.fileName,
      document.uploadedBy,
      document.status,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchText.includes(
      searchTerm.toLowerCase()
    );

    const matchesStatus =
      statusFilter === "All" || document.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const countStatus = (status) =>
    documents.filter((document) => document.status === status).length;

  const statusClass = (status) =>
    status.toLowerCase().replaceAll(" ", "-");

  return (
    <div className="documents-page">
      <div className="documents-header">
        <div>
          <h1>Document Management</h1>
          <p>Manage customer documents and solar project files.</p>
        </div>

        <button type="button" onClick={openAddForm}>
          + Upload Document
        </button>
      </div>

      <div className="documents-summary">
        <div className="document-summary-card">
          <span>Total Documents</span>
          <strong>{documents.length}</strong>
        </div>

        <div className="document-summary-card">
          <span>Pending</span>
          <strong>{countStatus("Pending")}</strong>
        </div>

        <div className="document-summary-card">
          <span>Verified</span>
          <strong>{countStatus("Verified")}</strong>
        </div>

        <div className="document-summary-card">
          <span>Rejected</span>
          <strong>{countStatus("Rejected")}</strong>
        </div>
      </div>

      {showForm && (
        <form className="document-form" onSubmit={handleSubmit}>
          <h2>
            {editingId !== null ? "Edit Document" : "Upload New Document"}
          </h2>

          <label>
            Document Title
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter document title"
              required
            />
          </label>

          <label>
            Document Category
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option>Quotation</option>
              <option>Invoice</option>
              <option>Site Visit Report</option>
              <option>Customer Document</option>
              <option>Installation Certificate</option>
              <option>Agreement</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Customer Name
            <input
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              placeholder="Enter customer name"
            />
          </label>

          <label>
            Project Name
            <input
              name="project"
              value={formData.project}
              onChange={handleChange}
              placeholder="Enter project name"
            />
          </label>

          <label className="document-full-width">
            Choose File
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              required={editingId === null}
            />

            <small>
              PDF, Word, Excel, JPG, or PNG. Maximum size: 10 MB.
            </small>

            {formData.fileName && (
              <span className="document-selected-file">
                Selected file: {formData.fileName}
              </span>
            )}

            {fileError && (
              <span role="alert" style={{ color: "#dc2626" }}>
                {fileError}
              </span>
            )}
          </label>

          <label>
            Uploaded By
            <input
              name="uploadedBy"
              value={formData.uploadedBy}
              onChange={handleChange}
              placeholder="Enter employee name"
              required
            />
          </label>

          <label>
            Upload Date
            <input
              type="date"
              name="uploadDate"
              value={formData.uploadDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Verification Status
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Pending</option>
              <option>Verified</option>
              <option>Rejected</option>
            </select>
          </label>

          <label className="document-full-width">
            Notes
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add notes or verification comments"
              rows="3"
            />
          </label>

          <div className="document-form-actions">
            <button type="submit">
              {editingId !== null ? "Update Document" : "Upload Document"}
            </button>

            <button
              type="button"
              className="document-cancel-button"
              onClick={closeForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="documents-list-card">
        <div className="documents-list-heading">
          <div>
            <h2>All Documents</h2>
            <p>Review, open, and manage your document records.</p>
          </div>

          <span>{filteredDocuments.length} records</span>
        </div>

        <div className="documents-filters">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search documents, customers, projects..."
            aria-label="Search documents"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter documents by status"
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="documents-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Document</th>
                <th>Customer / Project</th>
                <th>Uploaded By</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDocuments.map((document) => (
                <tr key={document.id}>
                  <td>
                    <strong>{document.title}</strong>

                    <p className="document-file-name">
                      {document.fileName}
                    </p>

                    <span className="document-category">
                      {document.category}
                    </span>
                  </td>

                  <td>
                    {document.customer || "—"}
                    <p className="document-project">
                      {document.project || "No project linked"}
                    </p>
                  </td>

                  <td>{document.uploadedBy}</td>
                  <td>{document.uploadDate}</td>

                  <td>
                    <span
                      className={`document-status status-${statusClass(
                        document.status
                      )}`}
                    >
                      {document.status}
                    </span>
                  </td>

                  <td>
                    <div className="document-action-buttons">
                      {document.fileUrl && (
                        <a
                          href={document.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-block",
                            padding: "7px 10px",
                            border: "1px solid #dbe2ea",
                            borderRadius: "7px",
                            color: "#2563eb",
                            fontSize: "12px",
                            textDecoration: "none",
                          }}
                        >
                          Open
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => openEditForm(document)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="document-delete-button"
                        onClick={() =>
                          handleDelete(document.id, document.title)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDocuments.length === 0 && (
                <tr>
                  <td colSpan="6" className="document-empty">
                    No documents found. Click Upload Document to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Documents;
