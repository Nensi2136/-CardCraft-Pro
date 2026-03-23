import { useState, useEffect } from "react";
import AdminLayout from "@/react-app/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/react-app/components/ui/select";
import { Mail, Search, Filter, Trash2, Eye, CheckCircle, XCircle, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { apiService, ApiResponse } from "@/react-app/services/api";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'read' | 'replied' | 'archived';
  createdAt: string;
  updatedAt?: string;
}

export default function ContactMessagesManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: ApiResponse<ContactMessage[]> = await apiService.contact.getMessages();
      
      if (response.success && response.data) {
        // Transform API response to ensure all required fields have defaults
        const transformedMessages: ContactMessage[] = response.data.map(msg => ({
          id: msg.id || '',
          name: msg.name || 'Unknown',
          email: msg.email || 'unknown@example.com',
          subject: msg.subject || 'No Subject',
          message: msg.message || '',
          status: msg.status || 'pending',
          createdAt: msg.createdAt || new Date().toISOString(),
          updatedAt: msg.updatedAt
        }));
        
        setMessages(transformedMessages);
        setFilteredMessages(transformedMessages);
      } else {
        setError(response.message || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    let filtered = messages;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        msg =>
          msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(msg => msg.status === statusFilter);
    }

    setFilteredMessages(filtered);
  }, [messages, searchTerm, statusFilter]);

  const getStatusBadge = (status: string | undefined) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      read: "bg-blue-100 text-blue-800",
      replied: "bg-green-100 text-green-800",
      archived: "bg-gray-100 text-gray-800"
    };

    const safeStatus = status || 'pending';
    const variant = variants[safeStatus as keyof typeof variants] || variants.pending;

    return (
      <Badge className={variant}>
        {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
      </Badge>
    );
  };

  const getStatusIcon = (status: string | undefined) => {
    const safeStatus = status || 'pending';
    switch (safeStatus) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'read':
        return <Eye className="w-4 h-4 text-blue-600" />;
      case 'replied':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'archived':
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <Mail className="w-4 h-4 text-gray-600" />;
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: ContactMessage['status']) => {
    try {
      const response = await apiService.contact.updateMessageStatus(messageId, newStatus);
      
      if (response.success) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId
              ? { ...msg, status: newStatus, updatedAt: new Date().toISOString() }
              : msg
          )
        );
      } else {
        console.error('Failed to update message status:', response.message);
      }
    } catch (error) {
      console.error('Failed to update message status:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const response = await apiService.contact.deleteMessage(messageId);
        
        if (response.success) {
          setMessages(prev => prev.filter(msg => msg.id !== messageId));
          if (selectedMessage?.id === messageId) {
            setSelectedMessage(null);
            setShowDetails(false);
          }
        } else {
          console.error('Failed to delete message:', response.message);
        }
      } catch (error) {
        console.error('Failed to delete message:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load messages</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchMessages} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contact Messages</h1>
            <p className="text-muted-foreground mt-1">Manage customer inquiries and support requests</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{filteredMessages.length}</span>
              <span className="text-sm text-muted-foreground">messages</span>
            </div>
            <Button 
              onClick={fetchMessages} 
              variant="outline" 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Label htmlFor="status-filter" className="sr-only">Status Filter</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages List */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No messages found</p>
                    </div>
                  ) : (
                    filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedMessage?.id === message.id ? 'border-purple-300 bg-purple-50 dark:bg-purple-950/20' : 'border-border'
                        }`}
                        onClick={() => {
                          setSelectedMessage(message);
                          setShowDetails(true);
                          if (message.status === 'pending') {
                            updateMessageStatus(message.id, 'read');
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(message.status)}
                            <h3 className="font-medium text-foreground">{message.subject}</h3>
                          </div>
                          {getStatusBadge(message.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>{message.name}</strong> ({message.email})
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                        <p className="text-xs text-muted-foreground/70 mt-2">{formatDate(message.createdAt)}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Details */}
          <div className="lg:col-span-1">
            {showDetails && selectedMessage ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Message Details
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedMessage.status)}</div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-foreground">From</Label>
                      <p className="mt-1 text-foreground">{selectedMessage.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-foreground">Subject</Label>
                      <p className="mt-1 text-foreground">{selectedMessage.subject}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-foreground">Message</Label>
                      <p className="mt-1 text-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-foreground">Received</Label>
                      <p className="mt-1 text-sm text-muted-foreground">{formatDate(selectedMessage.createdAt)}</p>
                    </div>

                    {selectedMessage.updatedAt && (
                      <div>
                        <Label className="text-sm font-medium text-foreground">Last Updated</Label>
                        <p className="mt-1 text-sm text-muted-foreground">{formatDate(selectedMessage.updatedAt)}</p>
                      </div>
                    )}

                    <div className="pt-4 border-t space-y-2">
                      {selectedMessage.status !== 'replied' && (
                        <Button
                          onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Replied
                        </Button>
                      )}
                      
                      {selectedMessage.status !== 'archived' && (
                        <Button
                          onClick={() => updateMessageStatus(selectedMessage.id, 'archived')}
                          variant="outline"
                          className="w-full"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Archive
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Select a message to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
