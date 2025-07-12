'use client'
import * as lucide from 'lucide-react';
import { players } from "../public/players";
import { Select, SelectItem } from "@heroui/select";
import { Button } from '@heroui/button';
import { useState } from 'react';
import { Chip } from "@heroui/chip";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { addToast, ToastProvider } from "@heroui/toast"
import { FlatTree } from 'framer-motion';

interface Player {
  name: string;
  sex: 'men' | 'women';
}

interface Team {
  id: number;
  players: Player[];
}

export default function Home() {
  const [selectedPlayer, setSelectedPlayer] = useState<Set<string>>(new Set());
  const [selectedTeamQuantity, setSelectedTeamQuantity] = useState<Set<string>>(new Set());
  const [teams, setTeams] = useState<Team[]>([]);
  const [placement, setPlacement] = useState("top-center");

  const sortedPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name));
  const teamQuantityOptions = [
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
  ];

  const playersToShow = Array.from(selectedPlayer)
    .map(name => players.find(p => p.name === name))
    .filter(Boolean) as Player[];

  const generateTeamsLogic = (players: Player[], teamQuantity: number): Team[] | null => {
    const maxPlayersAllowed = teamQuantity * 6;
    if (players.length > maxPlayersAllowed) {
      addToast({
        title: "Erro ao formar times",
        description: `Muitos jogadores selecionados. Para ${teamQuantity} times, o máximo é de ${maxPlayersAllowed} jogadores.`,
        color: 'danger',
        variant: "flat"

      });
      return null;
    }

    const women = players.filter(p => p.sex === 'women');
    const men = players.filter(p => p.sex === 'men');

    const shuffledWomen = [...women].sort(() => Math.random() - 0.5);
    const shuffledMen = [...men].sort(() => Math.random() - 0.5);

    const newTeams: Team[] = Array.from({ length: teamQuantity }, (_, i) => ({
      id: i + 1,
      players: [],
    }));

    shuffledWomen.forEach((player, index) => {
      const teamIndex = index % teamQuantity;
      newTeams[teamIndex].players.push(player);
    });

    const allPlayersShuffled = [...shuffledMen];
    let currentPlayerIndex = 0;
    while (currentPlayerIndex < allPlayersShuffled.length) {
      for (let i = 0; i < teamQuantity; i++) {
        if (currentPlayerIndex >= allPlayersShuffled.length) break;

        if (newTeams[i].players.length < 6) {
          newTeams[i].players.push(allPlayersShuffled[currentPlayerIndex]);
          currentPlayerIndex++;
        }
      }
    }

    newTeams.forEach(team => {
      team.players.sort((a, b) => a.name.localeCompare(b.name));
    });

    return newTeams;
  };

  const handleGenerateTeams = () => {
    const teamQuantityValue = Array.from(selectedTeamQuantity).at(0);

    if (playersToShow.length === 0 || !teamQuantityValue) {
      addToast({
        title: "Seleção Incompleta",
        description: "Por favor, selecione os jogadores e a quantidade de times.",
        color: 'danger',
        variant: "flat"
      })
      return;
    }

    const teamQuantity = Number(teamQuantityValue);

    if (playersToShow.length < teamQuantity) {
      addToast({
        title: "Jogadores Insuficientes",
        description: "O número de jogadores é menor que a quantidade de times desejada.",
        color: 'danger',
        variant: "flat"
      })
      return;
    }

    const generatedTeams = generateTeamsLogic(playersToShow, teamQuantity);

    if (generatedTeams) {
      setTeams(generatedTeams);
      addToast({
        title: "Sucesso",
        description: "Times gerados com sucesso!",
        color: 'success',
        variant: "flat"
      })
    }
  };

  return (
    <>
      <div className="fixed z-[100]">
        <ToastProvider placement={"top-center"} toastOffset={60} />
      </div>

      <div className="flex flex-col items-center p-4 w-full">
        <div className="flex flex-col items-center mb-8">
          <lucide.Volleyball className="w-24 h-24 text-blue-600" />
          <h1 className="text-4xl md:text-5xl font-bold mt-4 text-center text-gray-800">
            Gerador de Times
          </h1>
        </div>

        <div className="p-8 w-full max-w-lg">
          <Select
            className="w-full mb-4"
            variant="flat"
            radius="lg"
            label="Selecione os jogadores"
            onSelectionChange={(keys) => setSelectedPlayer(keys as Set<string>)}
            placeholder="Selecione um ou mais jogadores"
            selectionMode="multiple"
          >
            {sortedPlayers.map((player) => (
              <SelectItem key={player.name}>{player.name}</SelectItem>
            ))}
          </Select>

          <Select
            className="w-full mb-6"
            label="Quantidade de Times"
            placeholder="Selecione a quantidade"
            onSelectionChange={(keys) => setSelectedTeamQuantity(keys as Set<string>)}
          >
            {teamQuantityOptions.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>

          <Button color='primary' className='w-full' onClick={handleGenerateTeams}>
            Gerar times
          </Button>
        </div>


        {playersToShow.length > 0 && (
          <div className="mt-8 pt-6 border-t w-full max-w-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Jogadores Selecionados ({playersToShow.length})
            </h2>
            <ScrollShadow className="w-full max-h-[200px] p-2">
              <div className="flex flex-wrap gap-2">
                {playersToShow.map((player) => (
                  <Chip
                    key={player.name}
                    color={player.sex === 'women' ? 'danger' : 'primary'}
                    variant="flat"
                  >
                    {player.name}
                  </Chip>
                ))}
              </div>
            </ScrollShadow>
          </div>
        )}

        {teams.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 w-full max-w-4xl">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Times Gerados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map(team => (
                <div key={team.id} className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Time {team.id} ({team.players.length} jogadores)</h3>
                  <div className="space-y-2">
                    {team.players.map(player => (
                      <div key={player.name} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                        <span>{player.name}</span>
                        <Chip
                          color={player.sex === 'women' ? 'danger' : 'primary'}
                          variant="flat"
                          size="sm"
                        >
                          {player.sex === 'women' ? 'Mulher' : 'Homem'}
                        </Chip>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
