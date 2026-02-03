import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Registration {
  id: number;
  event_title: string;
  event_date: string;
  name: string;
  phone: string;
  email: string;
  vehicle: string | null;
  experience: string | null;
  status: string;
  created_at: string;
}

const Admin = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { toast } = useToast();

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' 
        ? 'https://functions.poehali.dev/4abcc351-37f6-4a3a-b6c4-f7d2560a6b3a'
        : `https://functions.poehali.dev/4abcc351-37f6-4a3a-b6c4-f7d2560a6b3a?status=${filter}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setRegistrations(data.registrations || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить заявки',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [filter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'confirmed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Новая';
      case 'confirmed': return 'Подтверждена';
      case 'cancelled': return 'Отменена';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Shield" size={32} className="text-primary" />
              <div>
                <h1 className="text-2xl font-bold">АДМИН-ПАНЕЛЬ</h1>
                <p className="text-sm text-muted-foreground">Управление заявками</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <Icon name="Home" size={16} className="mr-2" />
              На главную
            </Button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-3 flex-wrap">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Все заявки
          </Button>
          <Button 
            variant={filter === 'new' ? 'default' : 'outline'}
            onClick={() => setFilter('new')}
          >
            Новые
          </Button>
          <Button 
            variant={filter === 'confirmed' ? 'default' : 'outline'}
            onClick={() => setFilter('confirmed')}
          >
            Подтвержденные
          </Button>
          <Button 
            variant={filter === 'cancelled' ? 'default' : 'outline'}
            onClick={() => setFilter('cancelled')}
          >
            Отмененные
          </Button>
          <Button 
            variant="outline"
            onClick={fetchRegistrations}
            className="ml-auto"
          >
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Обновить
          </Button>
        </div>
      </div>

      {/* Registrations List */}
      <div className="container mx-auto px-4 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader2" size={48} className="animate-spin text-primary" />
          </div>
        ) : registrations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Icon name="Inbox" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">Заявок пока нет</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {registrations.map((reg) => (
              <Card key={reg.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {reg.event_title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(reg.status)}>
                          {getStatusText(reg.status)}
                        </Badge>
                        <Badge variant="outline">
                          <Icon name="Calendar" size={14} className="mr-1" />
                          {new Date(reg.event_date).toLocaleDateString('ru-RU')}
                        </Badge>
                        <Badge variant="outline">
                          <Icon name="Clock" size={14} className="mr-1" />
                          {formatDate(reg.created_at)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground">ID: {reg.id}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Icon name="User" size={18} className="text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Имя</p>
                          <p className="font-medium">{reg.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Phone" size={18} className="text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Телефон</p>
                          <p className="font-medium">{reg.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Mail" size={18} className="text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="font-medium">{reg.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {reg.vehicle && (
                        <div className="flex items-center gap-2">
                          <Icon name="Car" size={18} className="text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Автомобиль</p>
                            <p className="font-medium">{reg.vehicle}</p>
                          </div>
                        </div>
                      )}
                      {reg.experience && (
                        <div className="flex items-start gap-2">
                          <Icon name="Award" size={18} className="text-primary flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xs text-muted-foreground">Опыт</p>
                            <p className="text-sm">{reg.experience}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
