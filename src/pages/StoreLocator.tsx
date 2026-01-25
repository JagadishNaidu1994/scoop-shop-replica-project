
import React, { useState } from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock, Navigation, Search } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  hours: string;
  distance?: string;
}

const StoreLocator = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // Sample store data - in a real app, this would come from your database
  const stores: Store[] = [
    {
      id: '1',
      name: 'NASTEA Hyderabad Central',
      address: 'Shop No. 45, Ground Floor, Forum Sujana Mall',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      phone: '+91 40 1234 5678',
      hours: '10:00 AM - 10:00 PM',
      distance: '2.3 km'
    },
    {
      id: '2',
      name: 'NASTEA Banjara Hills',
      address: 'Road No. 12, Banjara Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
      phone: '+91 40 1234 5679',
      hours: '9:00 AM - 9:00 PM',
      distance: '4.7 km'
    },
    {
      id: '3',
      name: 'NASTEA Gachibowli',
      address: 'DLF Cyber City, Gachibowli',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500032',
      phone: '+91 40 1234 5680',
      hours: '10:00 AM - 10:00 PM',
      distance: '8.1 km'
    },
    {
      id: '4',
      name: 'NASTEA Bangalore HSR',
      address: 'HSR Layout, Sector 1',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560102',
      phone: '+91 80 1234 5678',
      hours: '10:00 AM - 9:00 PM',
      distance: '567 km'
    },
    {
      id: '5',
      name: 'NASTEA Mumbai Powai',
      address: 'Powai Plaza, Hiranandani Gardens',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400076',
      phone: '+91 22 1234 5678',
      hours: '10:00 AM - 10:00 PM',
      distance: '712 km'
    },
    {
      id: '6',
      name: 'NASTEA Delhi CP',
      address: 'Central Plaza, Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      phone: '+91 11 1234 5678',
      hours: '10:00 AM - 9:00 PM',
      distance: '1,567 km'
    }
  ];

  const [filteredStores, setFilteredStores] = useState(stores);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredStores(stores);
      return;
    }

    const filtered = stores.filter(store => 
      store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.pincode.includes(searchQuery) ||
      store.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStores(filtered);
  };

  const handleGetDirections = (store: Store) => {
    const address = `${store.address}, ${store.city}, ${store.state} ${store.pincode}`;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Find a NASTEA Store</h1>
          <p className="text-gray-600 text-lg">Discover our premium tea experience at a store near you</p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by city, state, or pincode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} className="bg-black text-white hover:bg-gray-800">
              Search
            </Button>
          </div>
        </div>

        {/* Results Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Store List */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-black mb-2">
                {filteredStores.length} store{filteredStores.length !== 1 ? 's' : ''} found
              </h2>
              <p className="text-gray-600">Click on a store to view details</p>
            </div>

            <div className="space-y-4">
              {filteredStores.map((store) => (
                <Card 
                  key={store.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedStore?.id === store.id ? 'ring-2 ring-black' : ''
                  }`}
                  onClick={() => setSelectedStore(store)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-black mb-2">{store.name}</h3>
                        <div className="space-y-2 text-gray-600">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                            <div>
                              <p>{store.address}</p>
                              <p>{store.city}, {store.state} {store.pincode}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <p>{store.phone}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <p>{store.hours}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-2">{store.distance}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGetDirections(store);
                          }}
                          className="flex items-center gap-1"
                        >
                          <Navigation className="h-4 w-4" />
                          Directions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStores.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No stores found</h3>
                <p className="text-gray-500">Try searching with a different location or check back soon for new stores.</p>
              </div>
            )}
          </div>

          {/* Store Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedStore ? (
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Store Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-black mb-2">{selectedStore.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {selectedStore.address}<br />
                      {selectedStore.city}, {selectedStore.state} {selectedStore.pincode}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <p className="text-sm">{selectedStore.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <p className="text-sm">{selectedStore.hours}</p>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button 
                      className="w-full bg-black text-white hover:bg-gray-800"
                      onClick={() => handleGetDirections(selectedStore)}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(`tel:${selectedStore.phone}`, '_self')}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Store
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-black mb-2">Store Services</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Tea tasting sessions</li>
                      <li>• Personal tea consultations</li>
                      <li>• Gift wrapping services</li>
                      <li>• Subscription setup</li>
                      <li>• Product exchanges</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-4">
                <CardContent className="p-6 text-center">
                  <MapPin className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">Select a store to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-black mb-4">Can't find a store near you?</h2>
            <p className="text-gray-600">We're expanding rapidly across India. Stay tuned for new locations!</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="font-semibold text-black mb-2">Online Shopping</h3>
              <p className="text-gray-600 mb-4">Shop our full collection online with free shipping on orders above ₹1000</p>
              <Button variant="outline" className="w-full">Shop Online</Button>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-black mb-2">Wholesale Inquiries</h3>
              <p className="text-gray-600 mb-4">Interested in carrying NASTEA products? Contact our wholesale team</p>
              <Button variant="outline" className="w-full">Contact Wholesale</Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StoreLocator;
