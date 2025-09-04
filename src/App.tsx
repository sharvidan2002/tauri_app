import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, Search, BarChart3, FileText, Settings } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import AddStaff from '@/components/staff/AddStaff';
import SearchStaff from '@/components/staff/SearchStaff';
import StaffList from '@/components/staff/StaffList';
import { useStaffCount } from '@/hooks/useStaff';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { data: staffCount, isLoading: countLoading } = useStaffCount();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Forest Office Staff Manager
            </h1>
            <p className="text-gray-600 text-lg">
              Divisional Forest Office - Vavuniya, Sri Lanka
            </p>
          </div>

          {/* Main Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5 mb-8">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search Staff</span>
              </TabsTrigger>
              <TabsTrigger value="add" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Staff</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Staff List</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Reports</span>
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Staff Card */}
                <Card className="stats-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="stats-number">
                      {countLoading ? '...' : staffCount?.total || 0}
                    </div>
                    <p className="stats-label">Active Members</p>
                  </CardContent>
                </Card>

                {/* Officers Card */}
                <Card className="stats-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Officers</CardTitle>
                    <UserPlus className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="stats-number">
                      {countLoading ? '...' :
                        staffCount?.byDesignation
                          ?.filter(d => d.designation.toLowerCase().includes('officer'))
                          ?.reduce((sum, d) => sum + d.count, 0) || 0
                      }
                    </div>
                    <p className="stats-label">Management Level</p>
                  </CardContent>
                </Card>

                {/* Male Staff Card */}
                <Card className="stats-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Male Staff</CardTitle>
                    <Users className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="stats-number">
                      {countLoading ? '...' :
                        staffCount?.byGender?.find(g => g.gender === 'Male')?.count || 0
                      }
                    </div>
                    <p className="stats-label">Male Members</p>
                  </CardContent>
                </Card>

                {/* Female Staff Card */}
                <Card className="stats-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Female Staff</CardTitle>
                    <Users className="h-4 w-4 text-pink-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="stats-number">
                      {countLoading ? '...' :
                        staffCount?.byGender?.find(g => g.gender === 'Female')?.count || 0
                      }
                    </div>
                    <p className="stats-label">Female Members</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Statistics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Staff by Designation */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Staff by Designation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {countLoading ? (
                        <div className="space-y-2">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="skeleton h-6 w-full" />
                          ))}
                        </div>
                      ) : (
                        staffCount?.byDesignation?.map(item => (
                          <div key={item.designation} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {item.designation}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                                  style={{
                                    width: `${Math.min((item.count / (staffCount?.total || 1)) * 100, 100)}%`
                                  }}
                                />
                              </div>
                              <span className="text-sm font-bold text-gray-900 min-w-[20px]">
                                {item.count}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={() => setActiveTab('add')}
                        className="btn-modern w-full justify-start bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl"
                      >
                        <UserPlus className="h-5 w-5 mr-3" />
                        Add New Staff Member
                      </button>

                      <button
                        onClick={() => setActiveTab('search')}
                        className="btn-modern w-full justify-start bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl"
                      >
                        <Search className="h-5 w-5 mr-3" />
                        Search & Filter Staff
                      </button>

                      <button
                        onClick={() => setActiveTab('list')}
                        className="btn-modern w-full justify-start bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-xl"
                      >
                        <Users className="h-5 w-5 mr-3" />
                        View All Staff
                      </button>

                      <button
                        onClick={() => setActiveTab('reports')}
                        className="btn-modern w-full justify-start bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-xl"
                      >
                        <FileText className="h-5 w-5 mr-3" />
                        Generate Reports
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Search Staff Tab */}
            <TabsContent value="search">
              <SearchStaff />
            </TabsContent>

            {/* Add Staff Tab */}
            <TabsContent value="add">
              <AddStaff />
            </TabsContent>

            {/* Staff List Tab */}
            <TabsContent value="list">
              <StaffList />
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Reports & Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Reports Coming Soon
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Advanced reporting and analytics features will be available in the next update.
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Staff performance reports</p>
                      <p>• Salary analysis</p>
                      <p>• Department statistics</p>
                      <p>• Custom report builder</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}

export default App;