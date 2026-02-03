import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [eventsDialogOpen, setEventsDialogOpen] = useState(false);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    experience: '',
    vehicle: '',
  });
  const { toast } = useToast();

  const handleRegister = (event: typeof events[0]) => {
    setSelectedEvent(event);
    setRegistrationDialogOpen(true);
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEvent) return;
    
    try {
      const response = await fetch('https://functions.poehali.dev/4abcc351-37f6-4a3a-b6c4-f7d2560a6b3a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_title: selectedEvent.title,
          event_date: selectedEvent.date,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          vehicle: formData.vehicle,
          experience: formData.experience,
        }),
      });
      
      if (response.ok) {
        toast({
          title: 'Заявка отправлена!',
          description: `Вы записались на "${selectedEvent.title}". Мы свяжемся с вами в ближайшее время!`,
        });
        setRegistrationDialogOpen(false);
        setFormData({ name: '', phone: '', email: '', experience: '', vehicle: '' });
      } else {
        throw new Error('Ошибка отправки');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить заявку. Попробуйте еще раз.',
        variant: 'destructive',
      });
    }
  };

  const events = [
    { 
      id: 1, 
      date: '2025-01-15', 
      title: 'Экспедиция в Карелию', 
      location: 'Карелия - Вуоксинские пороги',
      difficulty: 'Средний',
      participants: 12,
      status: 'Открыта регистрация'
    },
    { 
      id: 2, 
      date: '2025-01-22', 
      title: 'Покорение Алтая', 
      location: 'Алтай - Чуйский тракт',
      difficulty: 'Экстрим',
      participants: 8,
      status: 'Осталось 2 места'
    },
    { 
      id: 3, 
      date: '2025-02-05', 
      title: 'Зимний Урал', 
      location: 'Урал - Таганай',
      difficulty: 'Экстрим',
      participants: 15,
      status: 'Открыта регистрация'
    },
    { 
      id: 4, 
      date: '2025-02-18', 
      title: 'Кавказские высоты', 
      location: 'Кавказ - Эльбрус',
      difficulty: 'Хардкор',
      participants: 6,
      status: 'Требуется опыт'
    },
    { 
      id: 5, 
      date: '2025-03-10', 
      title: 'Весенний прорыв', 
      location: 'Алтай - Чуйский тракт',
      difficulty: 'Экстрим',
      participants: 10,
      status: 'Скоро старт'
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const routes = [
    { id: 1, name: 'Алтай - Чуйский тракт', difficulty: 'Экстрим', lat: 50.4, lng: 86.9, description: 'Легендарный маршрут с невероятными видами' },
    { id: 2, name: 'Кавказ - Эльбрус', difficulty: 'Хардкор', lat: 43.3, lng: 42.4, description: 'Покорение высочайших троп' },
    { id: 3, name: 'Карелия - Вуоксинские пороги', difficulty: 'Средний', lat: 61.1, lng: 30.2, description: 'Водные преграды и лесные дебри' },
    { id: 4, name: 'Урал - Таганай', difficulty: 'Экстрим', lat: 55.3, lng: 59.8, description: 'Каменные реки и суровая природа' },
  ];

  const services = [
    { icon: 'Truck', title: 'Прокат внедорожников', description: 'Подготовленные 4x4 автомобили с лебёдками и тюнингом' },
    { icon: 'Map', title: 'Гид по маршрутам', description: 'Опытные инструкторы знают каждый камень' },
    { icon: 'Wrench', title: 'Техническая поддержка', description: 'Ремонт и обслуживание в полевых условиях' },
    { icon: 'Users', title: 'Групповые экспедиции', description: 'Сообщество единомышленников для совместных поездок' },
  ];

  const gallery = [
    { 
      image: 'https://cdn.poehali.dev/projects/3ad7b360-5482-4ac3-bc58-bb950bf4ef60/files/a4ff083e-a3f0-4bdd-839c-45af4bb26e0c.jpg',
      title: 'Горные тропы',
      description: 'Преодоление каменистых перевалов'
    },
    { 
      image: 'https://cdn.poehali.dev/projects/3ad7b360-5482-4ac3-bc58-bb950bf4ef60/files/0dcdf5d9-bde4-4cbf-b6f3-afeb3cfbd1a4.jpg',
      title: 'Водные переправы',
      description: 'Групповое прохождение рек'
    },
    { 
      image: 'https://cdn.poehali.dev/projects/3ad7b360-5482-4ac3-bc58-bb950bf4ef60/files/ecde2a3f-d761-44d9-ac9a-cfa3e4c105b1.jpg',
      title: 'Пустынные дюны',
      description: 'Покорение песчаных барханов'
    },
    { 
      image: 'https://cdn.poehali.dev/projects/3ad7b360-5482-4ac3-bc58-bb950bf4ef60/files/75cb4627-a062-4329-94b5-79b2366e1dce.jpg',
      title: 'Экстремальные подъёмы',
      description: 'Техника прохождения крутых склонов'
    },
    { 
      image: 'https://cdn.poehali.dev/projects/3ad7b360-5482-4ac3-bc58-bb950bf4ef60/files/b24202f7-193a-48e8-922d-ebb56d4b7e1b.jpg',
      title: 'Грязевые ванны',
      description: 'Испытание техники в болотах'
    },
    { 
      image: 'https://cdn.poehali.dev/projects/3ad7b360-5482-4ac3-bc58-bb950bf4ef60/files/6f0d8afd-df57-41a8-97e6-8421a76616b2.jpg',
      title: 'Ночные выезды',
      description: 'Приключения под звёздами'
    },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Mountain" size={32} className="text-primary" />
            <span className="text-2xl font-bold">OFFROAD</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6">
            {['home', 'routes', 'services', 'gallery', 'reviews', 'community', 'contacts'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`text-sm uppercase tracking-wider hover:text-primary transition-colors ${
                  activeSection === section ? 'text-primary' : 'text-foreground/70'
                }`}
              >
                {section === 'home' && 'Главная'}
                {section === 'routes' && 'Маршруты'}
                {section === 'services' && 'Услуги'}
                {section === 'gallery' && 'Галерея'}
                {section === 'reviews' && 'Отзывы'}
                {section === 'community' && 'Сообщество'}
                {section === 'contacts' && 'Контакты'}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 hover:bg-accent/10 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/98 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {['home', 'routes', 'services', 'gallery', 'reviews', 'community', 'contacts'].map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    scrollToSection(section);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm uppercase tracking-wider transition-colors ${
                    activeSection === section 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent/10 text-foreground/70'
                  }`}
                >
                  {section === 'home' && 'Главная'}
                  {section === 'routes' && 'Маршруты'}
                  {section === 'services' && 'Услуги'}
                  {section === 'gallery' && 'Галерея'}
                  {section === 'reviews' && 'Отзывы'}
                  {section === 'community' && 'Сообщество'}
                  {section === 'contacts' && 'Контакты'}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20"></div>
        <div className="container mx-auto px-4 z-10 text-center animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-primary drop-shadow-2xl">
            ПОКОРЯЙ БЕЗДОРОЖЬЕ
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-foreground/90 max-w-2xl mx-auto">
            Экстремальные маршруты, адреналин и свобода. Присоединяйся к сообществу настоящих оффроудеров!
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 hover:scale-105 transition-transform"
              onClick={() => scrollToSection('routes')}
            >
              <Icon name="Map" size={20} className="mr-2" />
              Маршруты
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 hover:scale-105 transition-transform"
              onClick={() => scrollToSection('community')}
            >
              <Icon name="Users" size={20} className="mr-2" />
              Присоединиться
            </Button>
          </div>
        </div>
      </section>

      <section id="routes" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-4 text-primary animate-fade-in">
            ПОПУЛЯРНЫЕ МАРШРУТЫ
          </h2>
          <p className="text-center text-muted-foreground mb-8 text-lg">
            Интерактивная карта с проверенными местами для экстремальных поездок
          </p>

          <div className="flex gap-3 justify-center mb-8 flex-wrap">
            <Button 
              variant={difficultyFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setDifficultyFilter('all')}
              className="hover:scale-105 transition-transform"
            >
              <Icon name="Map" size={16} className="mr-2" />
              Все маршруты
            </Button>
            <Button 
              variant={difficultyFilter === 'Средний' ? 'default' : 'outline'}
              onClick={() => setDifficultyFilter('Средний')}
              className="hover:scale-105 transition-transform"
            >
              <Icon name="TrendingUp" size={16} className="mr-2" />
              Средний
            </Button>
            <Button 
              variant={difficultyFilter === 'Экстрим' ? 'default' : 'outline'}
              onClick={() => setDifficultyFilter('Экстрим')}
              className="hover:scale-105 transition-transform"
            >
              <Icon name="Zap" size={16} className="mr-2" />
              Экстрим
            </Button>
            <Button 
              variant={difficultyFilter === 'Хардкор' ? 'default' : 'outline'}
              onClick={() => setDifficultyFilter('Хардкор')}
              className="hover:scale-105 transition-transform"
            >
              <Icon name="Flame" size={16} className="mr-2" />
              Хардкор
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {routes.filter(route => difficultyFilter === 'all' || route.difficulty === difficultyFilter).map((route, index) => (
              <Card 
                key={route.id} 
                className="bg-background border-border hover:border-primary transition-all cursor-pointer hover:scale-105 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-bold text-foreground">{route.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      route.difficulty === 'Хардкор' ? 'bg-destructive text-destructive-foreground' :
                      route.difficulty === 'Экстрим' ? 'bg-primary text-primary-foreground' :
                      'bg-secondary text-secondary-foreground'
                    }`}>
                      {route.difficulty}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">{route.description}</p>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Icon name="MapPin" size={16} />
                    <span>Координаты: {route.lat}°N, {route.lng}°E</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-muted rounded-lg p-8 text-center">
            <Icon name="Map" size={64} className="mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-2">Интерактивная карта</h3>
            <p className="text-muted-foreground">
              Здесь будет полноценная карта с маршрутами и точками интереса
            </p>
          </div>
        </div>
      </section>

      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-4 text-secondary animate-fade-in">
            НАШИ УСЛУГИ
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Всё необходимое для незабываемого оффроуд приключения
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index}
                className="bg-card border-border hover:border-secondary transition-all hover:scale-105 animate-slide-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name={service.icon as any} size={32} className="text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-4 text-accent animate-fade-in">
            ГАЛЕРЕЯ
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Моменты настоящего экстрима
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {gallery.map((item, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-accent mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="community" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-primary/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <Icon name="Users" size={80} className="mx-auto mb-6 text-primary" />
            <h2 className="text-5xl font-bold mb-4 text-primary">
              ПРИСОЕДИНЯЙСЯ К СООБЩЕСТВУ
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Более 5000 оффроудеров уже делятся опытом, организуют совместные поездки и покоряют новые маршруты вместе
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg hover:scale-105 transition-transform">
                <Icon name="MessageCircle" size={20} className="mr-2" />
                Чат сообщества
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg hover:scale-105 transition-transform"
                onClick={() => setEventsDialogOpen(true)}
              >
                <Icon name="Calendar" size={20} className="mr-2" />
                События
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-4 text-primary animate-fade-in">
            ОТЗЫВЫ УЧАСТНИКОВ
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Что говорят о нас настоящие оффроудеры
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-xl transition-shadow animate-scale-in">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon name="User" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Алексей П.</h3>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <Icon key={star} name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  "Прошел маршрут по Алтаю — незабываемые эмоции! Организация на высшем уровне, гиды профессионалы. Обязательно вернусь ещё!"
                </p>
                <Badge className="mt-4" variant="outline">Алтай 2025</Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Icon name="User" size={24} className="text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Марина С.</h3>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <Icon key={star} name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  "Первый раз поехала в оффроуд и не пожалела! Команда помогла освоиться, всё объяснили и показали. Атмосфера дружеская, чувствуешь себя частью команды!"
                </p>
                <Badge className="mt-4" variant="outline">Карелия 2024</Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Icon name="User" size={24} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold">Дмитрий К.</h3>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <Icon key={star} name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  "Экстрим на Кавказе — испытание для настоящих мужчин! Техника была на высоте, маршрут продуман до мелочей. Огромное спасибо клубу!"
                </p>
                <Badge className="mt-4" variant="outline">Кавказ 2025</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-4 animate-fade-in">
            КОНТАКТЫ
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Свяжись с нами и начни своё приключение
          </p>
          
          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="animate-scale-in">
                <Icon name="Phone" size={40} className="mx-auto mb-3 text-primary" />
                <h3 className="font-bold mb-2">Телефон</h3>
                <p className="text-muted-foreground">+7 (999) 123-45-67</p>
              </div>
              <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <Icon name="Mail" size={40} className="mx-auto mb-3 text-secondary" />
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-muted-foreground">info@offroad.ru</p>
              </div>
              <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <Icon name="MapPin" size={40} className="mx-auto mb-3 text-accent" />
                <h3 className="font-bold mb-2">Адрес</h3>
                <p className="text-muted-foreground">Москва, ул. Экстрима, 1</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={registrationDialogOpen} onOpenChange={setRegistrationDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Icon name="UserPlus" size={28} />
              РЕГИСТРАЦИЯ НА ВЫЕЗД
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              {selectedEvent?.title} • {selectedEvent && formatDate(selectedEvent.date)}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitRegistration} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name" className="text-sm font-bold uppercase">
                Ваше имя *
              </Label>
              <Input
                id="name"
                placeholder="Иван Иванов"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-bold uppercase">
                Телефон *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-bold uppercase">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ivan@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="vehicle" className="text-sm font-bold uppercase">
                Ваш автомобиль
              </Label>
              <Input
                id="vehicle"
                placeholder="Toyota Land Cruiser 200"
                value={formData.vehicle}
                onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="experience" className="text-sm font-bold uppercase">
                Опыт оффроуда
              </Label>
              <Textarea
                id="experience"
                placeholder="Расскажите о своем опыте в оффроуде: какие маршруты проходили, сколько лет занимаетесь..."
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="mt-1 min-h-[80px]"
              />
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  После отправки заявки наш координатор свяжется с вами для подтверждения участия и обсуждения деталей маршрута.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1 hover:scale-105 transition-transform">
                <Icon name="Send" size={16} className="mr-2" />
                Отправить заявку
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setRegistrationDialogOpen(false)}
                className="hover:scale-105 transition-transform"
              >
                Отмена
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={eventsDialogOpen} onOpenChange={setEventsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-primary flex items-center gap-3">
              <Icon name="Calendar" size={32} />
              ЗАПЛАНИРОВАННЫЕ ВЫЕЗДЫ
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-6">
            {events.map((event, index) => (
              <Card 
                key={event.id} 
                className="bg-card border-border hover:border-primary transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-16 h-16 bg-primary/20 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                          <span className="text-2xl font-bold text-primary">
                            {new Date(event.date).getDate()}
                          </span>
                          <span className="text-xs text-primary uppercase">
                            {new Date(event.date).toLocaleDateString('ru-RU', { month: 'short' })}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-1">{event.title}</h3>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                            <Icon name="MapPin" size={14} />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge 
                              variant="outline" 
                              className={`${
                                event.difficulty === 'Хардкор' ? 'border-destructive text-destructive' :
                                event.difficulty === 'Экстрим' ? 'border-primary text-primary' :
                                'border-secondary text-secondary'
                              }`}
                            >
                              {event.difficulty}
                            </Badge>
                            <Badge variant="outline" className="border-accent text-accent">
                              <Icon name="Users" size={12} className="mr-1" />
                              {event.participants} участников
                            </Badge>
                            <Badge variant="default" className="bg-primary/20 text-primary border-primary">
                              {event.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="hover:scale-105 transition-transform"
                      onClick={() => handleRegister(event)}
                    >
                      <Icon name="UserPlus" size={16} className="mr-2" />
                      Записаться
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-6 bg-muted rounded-lg">
            <div className="flex items-start gap-4">
              <Icon name="Info" size={24} className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-2">Как присоединиться к выезду?</h4>
                <p className="text-sm text-muted-foreground">
                  Нажмите кнопку "Записаться" на интересующем событии. Наш координатор свяжется с вами в течение 24 часов для подтверждения участия и обсуждения деталей маршрута.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="bg-background border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="Mountain" size={24} className="text-primary" />
            <span className="text-xl font-bold">OFFROAD</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 OFFROAD. Покоряй бездорожье с нами!
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;