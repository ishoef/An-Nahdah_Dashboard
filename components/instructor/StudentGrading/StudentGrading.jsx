'use client';

import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Search, Download, Edit2, Trash2, Moon, Sun, Plus, X } from 'lucide-react';

const PRIMARY_COLOR = '#206380';

export default function StudentGradingSystem() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    course: '',
    marks: { math: '', science: '', english: '', history: '', computer: '' }
  });

  const certificateRef = useRef();

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('students');
    const savedDark = localStorage.getItem('darkMode');
    if (saved) setStudents(JSON.parse(saved));
    if (savedDark === 'true') setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('students, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const calculateGrade = (total) => {
    const percentage = (total / 500) * 100;
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'text-blue-600' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-yellow-600' };
    if (percentage >= 60) return { grade: 'B', color: 'text-orange-600' };
    if (percentage >= 50) return { grade: 'C', color: 'text-red-500' };
    return { grade: 'F', color: 'text-red-700' };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalMarks = Object.values(formData.marks).reduce((a, b) => a + (Number(b) || 0), 0);
    const { grade } = calculateGrade(totalMarks);

    const studentData = {
      id: editingId || Date.now(),
      ...formData,
      totalMarks,
      percentage: (totalMarks / 500) * 100,
      grade,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    if (editingId) {
      setStudents(students.map(s => s.id === editingId ? studentData : s));
    } else {
      setStudents([...students, studentData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', rollNo: '', course: '', marks: { math: '', science: '', english: '', history: '', computer: '' } });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      rollNo: student.rollNo,
      course: student.course,
      marks: student.marks
    });
    setEditingId(student.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const downloadCertificate = async (student) => {
    const element = certificateRef.current;
    
    // Temporarily update content
    document.getElementById('cert-name').textContent = student.name;
    document.getElementById('cert-roll').textContent = student.rollNo;
    document.getElementById('cert-course').textContent = student.course;
    document.getElementById('cert-grade').textContent = student.grade;
    document.getElementById('cert-date').textContent = student.date;

    const canvas = await html2canvas(element, { scale: 3 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`${student.name.replace(/\s+/g, '_')}_Certificate.pdf`);
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNo.includes(searchTerm)
  );

  return (
    <>
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
        {/* Hidden Certificate Template */}
      <div className="fixed -top-[9999px] left-0">
        <div ref={certificateRef} className="w-[1100px] h-[800px] bg-white relative overflow-hidden shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ background: `linear-gradient(45deg, ${PRIMARY_COLOR} 25%, transparent 25%)`, backgroundSize: '60px 60px' }}></div>
          </div>

          {/* Border */}
          <div className="absolute inset-8 border-8 rounded-xl" style={{ borderColor: PRIMARY_COLOR }}></div>
          <div className="absolute inset-12 border-4 rounded-xl" style={{ borderColor: PRIMARY_COLOR + '40' }}></div>

          {/* Logo & Header */}
          <div className="text-center pt-16">
            <div className="w-32 h-32 mx-auto bg-gray-200 border-4 rounded-full mb-6 flex items-center justify-center text-5xl font-bold" style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}>
              LOGO
            </div>
            <h1 className="text-5xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>ACADEMIC EXCELLENCE AWARD</h1>
            <p className="text-2xl text-gray-700">Certificate of Completion</p>
          </div>

          {/* Content */}
          <div className="text-center mt-20 px-20">
            <p className="text-xl text-gray-600 mb-10">This is to certify that</p>
            <h2 id="cert-name" className="text-5xl font-bold mb-8" style={{ color: PRIMARY_COLOR }}>Student Name</h2>
            <p className="text-xl text-gray-700 mb-6">
              Roll No: <span id="cert-roll" className="font-semibold">12345</span> | Course: <span id="cert-course" className="font-semibold">Computer Science</span>
            </p>
            <p className="text-xl text-gray-700 mb-12">
              Has successfully completed the course with <span id="cert-grade" className="font-bold text-3xl" style={{ color: PRIMARY_COLOR }}>A+</span> Grade
            </p>
            <p className="text-lg text-gray-600">Awarded on <span id="cert-date">December 04, 2025</span></p>
          </div>

          {/* Footer */}
          <div className="absolute bottom-20 left-20 right-20 flex justify-between items-end">
            <div className="text-center">
              <div className="border-t-2 border-gray-600 w-48 mt-20"></div>
              <p className="mt-2 text-gray-700">Principal</p>
            </div>
            <div className="text-center">
              <div className="border-t-2 border-gray-600 w-48 mt-20"></div>
              <p className="mt-2 text-gray-700">Director</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main UI */}
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold" style={{ color: PRIMARY_COLOR }}>Student Grading System</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>

        {/* Add Student Button */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition transform hover:scale-105"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            <Plus className="w-5 h-5" /> Add New Student
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-xl border dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        {/* Student List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <div key={student.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-8" style={{ borderLeftColor: PRIMARY_COLOR }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold">{student.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">Roll: {student.rollNo}</p>
                </div>
                <span className={`text-3xl font-bold ${calculateGrade(student.totalMarks).color}`}>
                  {student.grade}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <p><strong>Course:</strong> {student.course}</p>
                <p><strong>Total Marks:</strong> {student.totalMarks}/500 ({student.percentage.toFixed(1)}%)</p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleEdit(student)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => downloadCertificate(student)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-white font-medium transition"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  <Download className="w-4 h-4" /> Certificate
                </button>
                <button
                  onClick={() => handleDelete(student.id)}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold" style={{ color: PRIMARY_COLOR }}>
                  {editingId ? 'Edit Student' : 'Add New Student'}
                </h2>
                <button onClick={resetForm} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-5 py-3 rounded-lg border dark:bg-gray-700"
                  />
                  <input
                    type="text"
                    placeholder="Roll Number"
                    required
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="px-5 py-3 rounded-lg border dark:bg-gray-700"
                  />
                  <input
                    type="text"
                    placeholder="Course Name"
                    required
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="px-5 py-3 rounded-lg border dark:bg-gray-700 md:col-span-2"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                  {Object.keys(formData.marks).map((subject) => (
                    <div key={subject}>
                      <label className="block text-sm font-medium mb-1 capitalize">{subject} (100)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        required
                        value={formData.marks[subject]}
                        onChange={(e) => setFormData({
                          ...formData,
                          marks: { ...formData.marks, [subject]: e.target.value }
                        })}
                        className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="submit"
                    className="flex-1 py-4 rounded-lg text-white font-bold text-lg transition transform hover:scale-105"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                  >
                    {editingId ? 'Update Student' : 'Save Student'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-8 py-4 rounded-lg border-2 font-semibold transition"
                    style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}