import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Memory {
  id: number;
  title: string;
  date: string;
  image: string;
  tags: string[];
  people: string[];
}

const mockMemories: Memory[] = [
  {
    id: 1,
    title: 'День рождения',
    date: '2024-03-15',
    image: 'https://cdn.poehali.dev/projects/c273a456-9951-4483-a259-ce76035b30a0/files/1dedd1aa-bb6d-497e-adea-e9ed96155f9c.jpg',
    tags: ['праздник', 'семья'],
    people: ['Мама', 'Папа', 'Дети']
  },
  {
    id: 2,
    title: 'Летний отпуск',
    date: '2024-07-20',
    image: 'https://cdn.poehali.dev/projects/c273a456-9951-4483-a259-ce76035b30a0/files/1dedd1aa-bb6d-497e-adea-e9ed96155f9c.jpg',
    tags: ['отпуск', 'море'],
    people: ['Вся семья']
  },
  {
    id: 3,
    title: 'Первый день в школе',
    date: '2024-09-01',
    image: 'https://cdn.poehali.dev/projects/c273a456-9951-4483-a259-ce76035b30a0/files/1dedd1aa-bb6d-497e-adea-e9ed96155f9c.jpg',
    tags: ['школа', 'важное'],
    people: ['Дети']
  },
  {
    id: 4,
    title: 'Новогодняя ёлка',
    date: '2023-12-31',
    image: 'https://cdn.poehali.dev/projects/c273a456-9951-4483-a259-ce76035b30a0/files/1dedd1aa-bb6d-497e-adea-e9ed96155f9c.jpg',
    tags: ['праздник', 'зима'],
    people: ['Вся семья']
  },
  {
    id: 5,
    title: 'Пикник в парке',
    date: '2024-05-10',
    image: 'https://cdn.poehali.dev/projects/c273a456-9951-4483-a259-ce76035b30a0/files/1dedd1aa-bb6d-497e-adea-e9ed96155f9c.jpg',
    tags: ['природа', 'отдых'],
    people: ['Мама', 'Дети']
  },
  {
    id: 6,
    title: 'Выпускной',
    date: '2024-06-25',
    image: 'https://cdn.poehali.dev/projects/c273a456-9951-4483-a259-ce76035b30a0/files/1dedd1aa-bb6d-497e-adea-e9ed96155f9c.jpg',
    tags: ['важное', 'праздник'],
    people: ['Дети']
  }
];

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  const allTags = Array.from(new Set(mockMemories.flatMap(m => m.tags)));
  const allPeople = Array.from(new Set(mockMemories.flatMap(m => m.people)));

  const filteredMemories = mockMemories.filter(memory => {
    const matchesSearch = memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.date.includes(searchQuery);
    const matchesTag = !selectedTag || memory.tags.includes(selectedTag);
    const matchesPerson = !selectedPerson || memory.people.includes(selectedPerson);
    return matchesSearch && matchesTag && matchesPerson;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 space-y-6 animate-scale-in shadow-2xl">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                <Icon name="Heart" size={40} className="text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Семейный альбом
            </h1>
            <p className="text-muted-foreground">
              Приватное пространство для ваших воспоминаний
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-8 flex justify-center">
              <div className="w-48 h-48 bg-card border-4 border-primary rounded-xl flex items-center justify-center">
                <Icon name="QrCode" size={120} className="text-primary" />
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Отсканируйте QR-код для входа
            </p>
          </div>

          <Button 
            onClick={() => setIsAuthenticated(true)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            Демо-вход
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/30">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Icon name="Heart" size={24} className="text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Семейный альбом</h1>
            </div>
            <Button variant="ghost" size="icon">
              <Icon name="Settings" size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6 shadow-lg">
            <div className="space-y-4">
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию или дате..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Icon name="Tag" size={16} />
                    Теги
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={selectedTag === null ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedTag(null)}
                    >
                      Все
                    </Badge>
                    {allTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTag === tag ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Icon name="Users" size={16} />
                    Люди
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={selectedPerson === null ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedPerson(null)}
                    >
                      Все
                    </Badge>
                    {allPeople.map(person => (
                      <Badge
                        key={person}
                        variant={selectedPerson === person ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedPerson(person)}
                      >
                        {person}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemories.map((memory, index) => (
              <Card 
                key={memory.id} 
                className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={memory.image}
                    alt={memory.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-semibold text-lg">{memory.title}</h3>
                    <p className="text-sm opacity-90 flex items-center gap-1">
                      <Icon name="Calendar" size={14} />
                      {new Date(memory.date).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {memory.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Users" size={14} />
                    {memory.people.join(', ')}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredMemories.length === 0 && (
            <Card className="p-12 text-center">
              <Icon name="SearchX" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Воспоминания не найдены</p>
            </Card>
          )}
        </div>
      </main>

      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="rounded-full shadow-2xl h-14 w-14 p-0">
          <Icon name="Plus" size={24} />
        </Button>
      </div>
    </div>
  );
}
