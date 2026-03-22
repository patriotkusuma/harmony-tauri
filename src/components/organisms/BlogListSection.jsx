import asset_0_xwssmc from "assets/img/brand/harmony-blue.png";
import React from 'react';
import { Row, Col, Card, CardBody, CardFooter, Badge, Button } from 'reactstrap';
import moment from 'moment';
import Pagination from '../Pagination/Pagination';

const BlogListSection = ({ blogs, totalBlogs, rowPerPage, currentPage, setCurrentPage, onEdit, onDelete, isLoading }) => {
    return (
        <Card className="shadow-premium border-0 glass-card">
            <CardBody className="px-4 py-4">
              {isLoading ? (
                <div className="text-center py-5">
                  <i className="fas fa-circle-notch fa-spin fa-3x text-primary mb-3"></i>
                  <p className="h5 text-dark">Sinkronisasi data...</p>
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-5">
                  <i className="far fa-folder-open fa-4x text-muted mb-3"></i>
                  <h3 className="text-dark font-weight-bold">Belum ada konten artikel</h3>
                  <p className="text-sm text-dark">Mulai kembangkan marketing laundry lewat blog.</p>
                </div>
              ) : (
                <Row className="gy-4">
                  {blogs.map((blog) => (
                    <Col lg="4" md="6" xs="12" key={blog.id} className="mb-4">
                      <Card className="h-100 shadow-sm border-0 d-flex flex-column hover-elevate overflow-hidden transition-all bg-white" style={{ borderRadius: '15px' }}>
                        <div style={{ position: 'relative', height: '200px', backgroundColor: '#f8f9fa' }}>
                          {blog.thumbnail ? (
                            <img
                              className="card-img-top w-100 h-100"
                              src={blog.thumbnail.startsWith('http') ? blog.thumbnail : `https://go.harmonylaundry.my.id${blog.thumbnail}`}
                              alt={blog.title}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = asset_0_xwssmc;
                                e.target.style.objectFit = "contain";
                                e.target.style.padding = "20px";
                              }}
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-white">
                               <i className="fas fa-image fa-3x text-dark opacity-3" />
                            </div>
                          )}
                          <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                            <Badge color={blog.status === 'publish' ? 'success' : 'warning'} pill className="px-3 py-1 shadow-premium font-weight-bold text-uppercase" style={{ fontSize: '0.65rem' }}>
                              {blog.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <CardBody className="d-flex flex-column flex-grow-1 p-4">
                          <small className="text-primary text-xs font-weight-bold mb-2">
                            <i className="far fa-calendar me-2"></i>
                            {moment(blog.created_at).format("DD MMMM YYYY")}
                          </small>
                          <h4 className="mb-3 text-dark font-weight-bold" style={{ fontSize: '1.2rem', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: '#000' }}>
                            {blog.title}
                          </h4>
                          <p className="text-xs text-dark mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {blog.meta_desc || "Belum ada deskripsi singkat untuk artikel ini."}
                          </p>
                          <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-auto">
                            <Button outline color="primary" size="sm" className="px-3 py-1 font-weight-bold shadow-none rounded-pill" onClick={() => onEdit(blog)}>
                              <i className="fas fa-edit me-1" /> Edit
                            </Button>
                            <Button outline color="danger" size="sm" className="rounded-circle btn-icon-only shadow-none opacity-8" onClick={() => onDelete(blog.id)}>
                              <i className="fas fa-trash" />
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </CardBody>
            {totalBlogs > rowPerPage && (
              <CardFooter className="py-4 border-0">
                <Pagination
                  currentPage={currentPage}
                  rowPerPage={rowPerPage}
                  totalPosts={totalBlogs}
                  onPageChange={(page) => setCurrentPage(page)}
                  previousPage={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  nextPage={() => setCurrentPage(prev => prev + 1)}
                />
              </CardFooter>
            )}
            <style>{`
                .hover-elevate { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .hover-elevate:hover { transform: translateY(-10px); box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important; }
            `}</style>
        </Card>
    );
};

export default BlogListSection;
