import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';
import { getImageUrl } from '../utils';

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CastingProps {
  cast: CastMember[];
}

const Casting: React.FC<CastingProps> = ({ cast }) => {
  return (
    <>
      <Text style={styles.sectionTitle}>Actores y Personajes</Text>
      <ScrollView horizontal style={styles.container}>
        {cast.slice(0, 10).map((actor) => (
          <Card key={actor.id} style={styles.castCard}>
            <Card.Content>
              <Avatar.Image 
                size={80} 
                source={{ uri: actor.profile_path ? getImageUrl(actor.profile_path, "200") : 'https://via.placeholder.com/200' }} 
              />
              <Text style={styles.actorName}>{actor.name}</Text>
              <Text numberOfLines={1} ellipsizeMode='middle' style={styles.characterName}>{actor.character}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginHorizontal: 16,
  },
  container: {
    marginTop: 8,
    marginHorizontal: 16,
    height: 200,
  },
  castCard: {
    width: 120,
    marginRight: 8,
    height: '80%',
  },
  actorName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  characterName: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default Casting;